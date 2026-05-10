import React, { useState } from 'react';
import { createComment } from '../services/api';

function CommentNode({ comment, postId, onReplySuccess }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState('');
  const [replyAuthor, setReplyAuthor] = useState(''); // Temporary until auth is hooked up

  const handleReplySubmit = async (e) => {
    e.preventDefault();
    try {
      await createComment(postId, {
        text: replyText,
        author: replyAuthor,
        parentId: comment.id // This makes it a nested reply!
      });
      setShowReplyForm(false);
      setReplyText('');
      setReplyAuthor('');
      onReplySuccess(); // Tell the parent page to refresh the comments
    } catch (error) {
      console.error("Failed to post reply", error);
    }
  };

  return (
    <div style={{ 
      marginTop: '10px', 
      paddingLeft: '20px', 
      borderLeft: '2px solid var(--border-color)' 
    }}>
      <div style={{ padding: '15px', backgroundColor: 'var(--bg-color)', borderRadius: '6px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <strong style={{ color: 'var(--accent-color)' }}>{comment.author}</strong>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {new Date(comment.timestamp).toLocaleDateString()}
          </span>
        </div>
        <p style={{ marginTop: '8px' }}>{comment.text}</p>
        
        <button 
          onClick={() => setShowReplyForm(!showReplyForm)}
          style={{ marginTop: '10px', fontSize: '0.8rem', padding: '4px 8px', backgroundColor: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' }}
        >
          Reply
        </button>

        {/* Reply Form */}
        {showReplyForm && (
          <form onSubmit={handleReplySubmit} style={{ marginTop: '10px', display: 'flex', gap: '10px', flexDirection: 'column' }}>
            <input 
              type="text" 
              placeholder="Your Name" 
              value={replyAuthor} 
              onChange={(e) => setReplyAuthor(e.target.value)}
              required
              style={{ padding: '8px', background: 'var(--surface-color)', color: 'white', border: 'none', borderRadius: '4px' }}
            />
            <textarea 
              placeholder="Write a reply..." 
              value={replyText} 
              onChange={(e) => setReplyText(e.target.value)}
              required
              style={{ padding: '8px', background: 'var(--surface-color)', color: 'white', border: 'none', borderRadius: '4px', minHeight: '60px' }}
            />
            <button type="submit" style={{ alignSelf: 'flex-start' }}>Submit Reply</button>
          </form>
        )}
      </div>

      {/* THE RECURSION: If this comment has replies, render them using this exact same component! */}
      {comment.replies && comment.replies.length > 0 && (
        <div style={{ marginTop: '10px' }}>
          {comment.replies.map(reply => (
            <CommentNode 
              key={reply.id} 
              comment={reply} 
              postId={postId} 
              onReplySuccess={onReplySuccess} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default CommentNode;