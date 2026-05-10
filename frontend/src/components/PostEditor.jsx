import React, { useState } from 'react';
import { updatePost } from '../services/api';

function PostEditor({ post, onSaveSuccess, onCancel }) {
  const [editTitle, setEditTitle] = useState(post.title);
  const [editBody, setEditBody] = useState(post.body);
  const [editCategory, setEditCategory] = useState(post.category || '');
  const [editTagsInput, setEditTagsInput] = useState(post.tags ? post.tags.join(', ') : '');

  const handleUpdatePost = async () => {
    const tagsArray = editTagsInput.split(',').map(tag => tag.trim()).filter(tag => tag !== '');

    try {
      await updatePost(post.id, { 
        title: editTitle, 
        body: editBody, 
        category: editCategory, 
        tags: tagsArray 
      });
      onSaveSuccess(); // Tells the parent to close the editor and refresh data
    } catch (error) {
      alert("Failed to update post.");
    }
  };

  return (
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
        <button onClick={onCancel} style={{ backgroundColor: 'transparent', border: '1px solid #cf6679', color: '#cf6679', padding: '10px 20px' }}>Cancel Edit</button>
      </div>
    </div>
  );
}

export default PostEditor;