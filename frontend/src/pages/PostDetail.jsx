import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById, getComments, createComment } from '../services/api';
import CommentNode from '../components/CommentNode';

function PostDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  
  // State for top-level comment form
  const [newCommentText, setNewCommentText] = useState('');
//   const [newCommentAuthor, setNewCommentAuthor] = useState('');

  const fetchPostAndComments = useCallback(async () => {
    try {
      const postData = await getPostById(id);
      setPost(postData);
      
      const commentsData = await getComments(id, 0, 50); // Fetching up to 50 top-level comments for now
      setComments(commentsData.content);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  }, [id]);

  useEffect(() => {
    fetchPostAndComments();
  }, [fetchPostAndComments]);

const handleTopLevelCommentSubmit = async (e) => {
    e.preventDefault();
    const currentUser = localStorage.getItem('username'); // Get it from storage!
    
    if (!currentUser) {
        alert("You must be logged in to comment.");
        return;
    }

    try {
      await createComment(id, { text: newCommentText, author: currentUser });
      setNewCommentText('');
      fetchPostAndComments();
    } catch (error) {
      console.error("Failed to post comment");
    }
  };

  if (!post) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      {/* Post Content */}
      <div style={{ padding: '30px', backgroundColor: 'var(--surface-color)', borderRadius: '8px' }}>
        <h1 style={{ color: 'var(--accent-color)' }}>{post.title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>By {post.author} • {new Date(post.timestamp).toLocaleDateString()}</p>
        <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>{post.body}</div>
      </div>

      {/* Comment Section */}
      <div style={{ marginTop: '40px' }}>
        <h3>Comments</h3>
        
        {/* Top-Level Comment Form */}
        <form onSubmit={handleTopLevelCommentSubmit} style={{ marginTop: '20px', marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', backgroundColor: 'var(--surface-color)', borderRadius: '8px' }}>
          <h4>Leave a comment</h4>
          {/* <input type="text" placeholder="Your Name" value={newCommentAuthor} onChange={(e) => setNewCommentAuthor(e.target.value)} required style={{ padding: '10px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '4px' }} /> */}
          <textarea placeholder="What are your thoughts?" value={newCommentText} onChange={(e) => setNewCommentText(e.target.value)} required style={{ padding: '10px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '4px', minHeight: '80px' }} />
          <button type="submit" style={{ alignSelf: 'flex-end' }}>Post Comment</button>
        </form>

        {/* The Nested Comment Tree */}
        <div>
          {comments.length === 0 ? <p>No comments yet. Be the first!</p> : 
            comments.map(comment => (
              <CommentNode key={comment.id} comment={comment} postId={id} onReplySuccess={fetchPostAndComments} />
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default PostDetail;