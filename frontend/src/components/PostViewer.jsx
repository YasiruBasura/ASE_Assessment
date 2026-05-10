import React from 'react';

function PostViewer({ post, currentUser, readerCount, onEdit, onDelete }) {
  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <h1 style={{ color: 'var(--accent-color)', margin: 0 }}>{post.title}</h1>
        
        {currentUser === post.author && (
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={onEdit} style={{ padding: '5px 10px', fontSize: '0.8rem', backgroundColor: 'transparent', border: '1px solid var(--accent-color)', color: 'var(--accent-color)' }}>Edit</button>
            <button onClick={onDelete} style={{ padding: '5px 10px', fontSize: '0.8rem', backgroundColor: 'transparent', border: '1px solid #cf6679', color: '#cf6679' }}>Delete</button>
          </div>
        )}
      </div>

      <div style={{ margin: '12px 0', display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {post.category && (
          <span style={{ backgroundColor: 'var(--accent-color)', color: '#000', padding: '4px 10px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>
            {post.category.toUpperCase()}
          </span>
        )}
        
        {post.tags && post.tags.map((tag, index) => (
          <span key={index} style={{ backgroundColor: 'rgba(255,255,255,0.1)', color: '#ccc', padding: '4px 10px', borderRadius: '15px', fontSize: '0.8rem', border: '1px solid var(--border-color)' }}>
            #{tag}
          </span>
        ))}
      </div>

      <p style={{ color: 'var(--text-secondary)', margin: '15px 0 20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
        <span>By {post.author} • {new Date(post.timestamp).toLocaleDateString()}</span>
        <span style={{ backgroundColor: 'rgba(187, 134, 252, 0.1)', color: 'var(--accent-color)', padding: '4px 10px', borderRadius: '15px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
          <span style={{ display: 'inline-block', width: '8px', height: '8px', backgroundColor: 'var(--accent-color)', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
          {readerCount} {readerCount === 1 ? 'person' : 'people'} viewing
        </span>
      </p>
      
      <div style={{ fontSize: '1.1rem', lineHeight: '1.8' }}>{post.body}</div>
    </>
  );
}

export default PostViewer;