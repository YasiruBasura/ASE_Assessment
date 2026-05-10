import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById, getComments, createComment, updatePost, deletePost } from '../services/api';
import CommentNode from '../components/CommentNode';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

function PostDetail() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('username'); // Get the logged in user
  
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editBody, setEditBody] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editTagsInput, setEditTagsInput] = useState('');

  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  
  const [newCommentText, setNewCommentText] = useState('');
  const [readerCount, setReaderCount] = useState(1); // Defaults to 1 (since you are reading it!)

  const fetchPostAndComments = useCallback(async () => {
    try {
      const postData = await getPostById(id);
      setPost(postData);
      
      const commentsData = await getComments(id, 0, 50); 
      setComments(commentsData.content);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }, [id]);


  // --- 1. INITIAL DATA LOAD ---
  useEffect(() => {
    fetchPostAndComments();
  }, [fetchPostAndComments]);

  // --- 2. WEBSOCKET CONNECTION ---
  useEffect(() => {
    // 1. Fetch the exact current viewer count immediately!
    import('../services/api').then(({ getPostLiveCount }) => {
        getPostLiveCount(id).then(setReaderCount);
    });

    // 2. Then connect to WebSocket to listen for changes
    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);
    stompClient.debug = null; // Hides heavy logs in the browser console

    stompClient.connect({}, () => {
      console.log(`🟢 Connected to Live Chat for Post ${id}`);
      
      stompClient.subscribe(`/topic/posts/${id}/comments`, (message) => {
        console.log("📡 Live Broadcast Received!");
      // 1. Instantly refresh the comments when a broadcast arrives!
        fetchPostAndComments(); 
      });

      // 2. Listen for live reader count updates 
      stompClient.subscribe(`/topic/posts/${id}/readers`, (message) => {
        console.log("👁️ Reader count updated:", message.body);
        setReaderCount(parseInt(message.body));
      });
    }, (error) => {
      console.error("🔴 WebSocket Connection Error:", error);
    });

    // Disconnect when the user leaves the page
    return () => {
      if (stompClient.connected) {
        stompClient.disconnect();
        console.log("🔴 Disconnected from WebSocket");
      }
    };
  }, [id, fetchPostAndComments]);

  const handleTopLevelCommentSubmit = async (e) => {
    e.preventDefault();
    const currentUser = localStorage.getItem('username');
    
    if (!currentUser) {
        alert("You must be logged in to comment.");
        return;
    }

    try {
      // We save it to the DB via REST API. 
      // The backend will automatically broadcast it to the WebSocket!
      await createComment(id, { text: newCommentText, author: currentUser });
      setNewCommentText('');
      // Note: We don't need to manually call fetchPostAndComments() here anymore,
      // because our own WebSocket listener will hear the broadcast and trigger it!
    } catch (error) {
      console.error("Failed to post comment");
    }
  };

  //   const handleDeletePost = async () => {
  //   if (window.confirm("Are you sure you want to delete this post?")) {
  //     try {
  //       await deletePost(id);
  //       navigate('/'); // Go back to home feed after deleting
  //     } catch (error) {
  //       alert("Failed to delete post.");
  //     }
  //   }
  // };
// Triggers when the user clicks the initial "Delete" button on the post
  const promptDelete = () => {
    setIsDeleteModalOpen(true);
  };

  // Triggers ONLY when they click "Delete Forever" inside the custom modal
  const confirmDelete = async () => {
    try {
      await deletePost(id);
      navigate('/'); // Go back to home feed after deleting
    } catch (error) {
      alert("Failed to delete post.");
      setIsDeleteModalOpen(false); // Close modal if it fails
    }
  };

  const handleUpdatePost = async () => {
    // Convert the string back to an array before sending to the backend
    const tagsArray = editTagsInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== '');

    try {
      await updatePost(id, { 
        title: editTitle, 
        body: editBody, 
        category: editCategory, 
        tags: tagsArray 
      });
      setIsEditing(false);
      fetchPostAndComments(); // Refresh the data!
    } catch (error) {
      alert("Failed to update post.");
    }
  };

  const startEditing = () => {
    setEditTitle(post.title);
    setEditBody(post.body);
    setEditCategory(post.category || '');
    setEditTagsInput(post.tags ? post.tags.join(', ') : ''); 
    setIsEditing(true);
  };
  

  if (!post) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      {/* Post Content */}
      <div style={{ padding: '30px', backgroundColor: 'var(--surface-color)', borderRadius: '8px' }}>
        
        {isEditing ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input 
              value={editTitle} 
              onChange={(e) => setEditTitle(e.target.value)} 
              placeholder="Post Title"
              style={{ padding: '10px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)', fontSize: '1.5rem', borderRadius: '4px' }} 
            />
            
            <select 
              value={editCategory} 
              onChange={(e) => setEditCategory(e.target.value)} 
              style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'white', fontSize: '1rem' }}
            >
              <option value="" disabled>Select a Category...</option>
              <option value="Technology">Technology</option>
              <option value="Tutorial">Tutorial</option>
              <option value="Opinion">Opinion</option>
              <option value="News">News</option>
              <option value="Lifestyle">Lifestyle</option>
            </select>

            <input 
              value={editTagsInput} 
              onChange={(e) => setEditTagsInput(e.target.value)} 
              placeholder="Tags (comma-separated, e.g., java, react, web)"
              style={{ padding: '10px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)', fontSize: '1rem', borderRadius: '4px' }} 
            />

            <textarea 
              value={editBody} 
              onChange={(e) => setEditBody(e.target.value)} 
              placeholder="Post Content"
              style={{ padding: '10px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)', minHeight: '150px', borderRadius: '4px', fontFamily: 'inherit' }} 
            />
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button onClick={handleUpdatePost} style={{ backgroundColor: '#4caf50', padding: '10px 20px' }}>Save Changes</button>
              
              {/* CLEAR CANCEL BUTTON: Closes the edit mode without saving */}
              <button onClick={() => setIsEditing(false)} style={{ backgroundColor: 'transparent', border: '1px solid #cf6679', color: '#cf6679', padding: '10px 20px' }}>Cancel Edit</button>
            </div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h1 style={{ color: 'var(--accent-color)', margin: 0 }}>{post.title}</h1>
              
              {/* SECURITY: Only show Edit/Delete if the logged in user wrote this post! */}
              {currentUser === post.author && (
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button onClick={startEditing} style={{ padding: '5px 10px', fontSize: '0.8rem', backgroundColor: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)' }}>Edit</button>
                  <button onClick={promptDelete} style={{ padding: '5px 10px', fontSize: '0.8rem', backgroundColor: 'transparent', border: '1px solid #cf6679', color: '#cf6679' }}>Delete</button>
                </div>
              )}
            </div>

            {/* --- NEW: CATEGORY AND TAGS DISPLAY --- */}
            <div style={{ margin: '12px 0', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              {/* Category Badge */}
              {post.category && (
                <span style={{ backgroundColor: 'var(--accent-color)', color: '#000', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                  {post.category.toUpperCase()}
                </span>
              )}
              
              {/* Tag Pills */}
              {post.tags && post.tags.map((tag, index) => (
                <span key={index} style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#ccc', padding: '4px 10px', borderRadius: '15px', fontSize: '0.8rem', border: '1px solid var(--border-color)' }}>
                  #{tag}
                </span>
              ))}
            </div>
            {/* -------------------------------------- */}

            <p style={{ color: 'var(--text-secondary)', margin: '15px 0 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
              <span>By {post.author} • {new Date(post.timestamp).toLocaleDateString()}</span>
              {/* Keep your live reader count badge right here! */}
              <span style={{ backgroundColor: 'rgba(187, 134, 252, 0.1)', color: 'var(--accent-color)', padding: '4px 10px', borderRadius: '15px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: 'var(--accent-color)', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
                {readerCount} {readerCount === 1 ? 'person' : 'people'} viewing
              </span>
            </p>
            <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>{post.body}</div>
          </>
        )}
      </div>

      <div style={{ marginTop: '40px' }}>
        <h3>Comments</h3>
        
        <form onSubmit={handleTopLevelCommentSubmit} style={{ marginTop: '20px', marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', backgroundColor: 'var(--surface-color)', borderRadius: '8px' }}>
          <h4>Leave a comment</h4>
          <textarea placeholder="What are your thoughts?" value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} required style={{ padding: '10px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '4px', minHeight: '80px' }} />
          <button type="submit" style={{ alignSelf: 'flex-end' }}>Post Comment</button>
        </form>

        <div>
          {comments.length === 0 ? <p>No comments yet. Be the first!</p> : 
            comments.map(comment => (
              <CommentNode key={comment.id} comment={comment} postId={id} onReplySuccess={() => {}} />
            ))
          }
        </div>
      </div>
      <DeleteConfirmationModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={confirmDelete} 
      />

    </div>
  );

}

export default PostDetail;