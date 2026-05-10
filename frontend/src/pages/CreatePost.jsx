import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/api';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('');
  const [tagsInput, setTagsInput] = useState(''); // Store as string, convert to array on submit
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUser = localStorage.getItem('username');

    if (!currentUser) {
      alert("You must be logged in to create a post.");
      navigate('/login');
      return;
    }

    // Convert "react, spring boot, coding" -> ["react", "spring boot", "coding"]
    const tagsArray = tagsInput
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag !== ''); // Remove empty tags if someone types ",,"

    try {
      await createPost({ 
          title, 
          body, 
          category, 
          tags: tagsArray, 
          author: currentUser 
      });
      navigate('/'); 
    } catch (error) {
      console.error("Failed to create post", error);
      alert("Failed to create post. Please try again.");
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '40px auto', padding: '30px', backgroundColor: 'var(--surface-color)', borderRadius: '8px' }}>
      <h2 style={{ color: 'var(--accent-color)' }}>Create a New Post</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
        
        <input 
          type="text" 
          placeholder="Post Title" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'white', fontSize: '1.1rem' }}
        />

        <select 
          value={category} 
          onChange={(e) => setCategory(e.target.value)} 
          required
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
          type="text" 
          placeholder="Tags (comma-separated, e.g., java, react, web)" 
          value={tagsInput}
          onChange={(e) => setTagsInput(e.target.value)}
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'white', fontSize: '1rem' }}
        />

        <textarea 
          placeholder="Write your post content here..." 
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'white', minHeight: '200px', fontSize: '1rem', fontFamily: 'inherit' }}
        />

        <button type="submit" style={{ alignSelf: 'flex-start', padding: '10px 20px', fontSize: '1.1rem' }}>Publish Post</button>
      </form>
    </div>
  );
}

export default CreatePost;