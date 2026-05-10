import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getPostById, getComments, createComment } from '../services/api';
import CommentNode from '../components/CommentNode';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

function PostDetail() {
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

      // 2. Listen for live reader count updates (ADD THIS BLOCK)
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

  if (!post) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <div style={{ padding: '30px', backgroundColor: 'var(--surface-color)', borderRadius: '8px' }}>
        <h1 style={{ color: 'var(--accent-color)' }}>{post.title}</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>By {post.author} • {new Date(post.timestamp).toLocaleDateString()}
          
          {/* Live Reader Badge */}
          <span style={{ backgroundColor: 'rgba(187, 134, 252, 0.1)', color: 'var(--accent-color)', padding: '4px 10px', borderRadius: '15px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: 'var(--accent-color)', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
            {readerCount} {readerCount === 1 ? 'person' : 'people'} viewing
          </span>
        </p>
        <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>{post.body}</div>
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
    </div>
  );
}

export default PostDetail;