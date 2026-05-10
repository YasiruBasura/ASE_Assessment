import React, { useState } from 'react';
import { createComment } from '../services/api';
import CommentNode from './CommentNode';

function CommentSection({ postId, comments }) {
  const [newCommentText, setNewCommentText] = useState('');

  const handleTopLevelCommentSubmit = async (e) => {
    e.preventDefault();
    const currentUser = localStorage.getItem('username');
    
    if (!currentUser) {
        alert("You must be logged in to comment.");
        return;
    }

    try {
      await createComment(postId, { text: newCommentText, author: currentUser });
      setNewCommentText('');
    } catch (error) {
      console.error("Failed to post comment");
    }
  };

  return (
    <div style={{ marginTop: '40px' }}>
      <h3>Comments</h3>
      
      <form onSubmit={handleTopLevelCommentSubmit} style={{ marginTop: '20px', marginBottom: '40px', display: 'flex', flexDirection: 'column', gap: '10px', padding: '20px', backgroundColor: 'var(--surface-color)', borderRadius: '8px' }}>
        <h4>Leave a comment</h4>
        <textarea 
          placeholder="What are your thoughts?" 
          value={newCommentText} 
          onChange={(e) => setNewCommentText(e.target.value)} 
          required 
          style={{ padding: '10px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)', borderRadius: '4px', minHeight: '80px' }} 
        />
        <button type="submit" style={{ alignSelf: 'flex-end' }}>Post Comment</button>
      </form>

      <div>
        {comments.length === 0 ? <p>No comments yet. Be the first!</p> : 
          comments.map(comment => (
            <CommentNode key={comment.id} comment={comment} postId={postId} onReplySuccess={() => {}} />
          ))
        }
      </div>
    </div>
  );
}

export default CommentSection;