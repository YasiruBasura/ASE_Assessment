import React, { useState, useEffect } from 'react';
import { getPosts } from '../services/api';

function HomeFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      // Fetching page 0, size 10 to hit the pagination requirement
      const data = await getPosts(0, 10); 
      setPosts(data.content); // Extracting the array from Spring's Page object
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading posts...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>
      <h1>Latest Posts</h1>
      
      {posts.length === 0 ? (
        <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>No posts found. Create one via Postman to see it here!</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} style={{ marginTop: '20px', padding: '20px', backgroundColor: 'var(--surface-color)', borderRadius: '8px' }}>
            <h3 style={{ color: 'var(--accent-color)' }}>{post.title}</h3>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '15px' }}>
              By {post.author} in {post.category} • {new Date(post.timestamp).toLocaleDateString()}
            </p>
            
            <p>{post.body}</p>
            
            <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
              {post.tags.map(tag => (
                <span key={tag} style={{ padding: '4px 8px', backgroundColor: 'var(--border-color)', borderRadius: '4px', fontSize: '0.75rem' }}>
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default HomeFeed;