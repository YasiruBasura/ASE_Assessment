import React, { useState, useEffect } from 'react';
import { getPosts } from '../services/api';
import { Link } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

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

  
const [liveCounts, setLiveCounts] = useState({});

  // --- WEBSOCKET FOR GLOBAL COUNTS ---
  useEffect(() => {

    // 1. Fetch the exact current snapshot immediately!
    import('../services/api').then(({ getGlobalLiveCounts }) => {
        getGlobalLiveCounts().then(setLiveCounts);
    });

    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);
    stompClient.debug = null;

    stompClient.connect({}, () => {
      // Listen to the new global channel
      stompClient.subscribe('/topic/readers/all', (message) => {
        const countsMap = JSON.parse(message.body);
        setLiveCounts(countsMap);
      });
    });

    return () => {
      if (stompClient.connected) {
        stompClient.disconnect();
      }
    };
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading posts...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '40px auto', padding: '20px' }}>

      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
       
        {localStorage.getItem('username') && (
          <Link to="/create-post">
            <button>+ Create Post</button>
          </Link>
        )}
      </div>

      <h1>Latest Posts</h1>
      
      {posts.length === 0 ? (
        <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>No posts found. Create one via Postman to see it here!</p>
      ) : (
        posts.map((post) => (
          <div key={post.id} style={{ marginTop: '20px', padding: '20px', backgroundColor: 'var(--surface-color)', borderRadius: '8px' }}>
            <Link to={`/post/${post.id}`}>
              <h3 style={{ color: 'var(--accent-color)' }}>{post.title}</h3>
            </Link>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '15px' }}>
              By {post.author} in {post.category} • {new Date(post.timestamp).toLocaleDateString()}
            
            {/* Live Reader Badge for the Home Feed */}
            {liveCounts[post.id] > 0 && (
              <span style={{ backgroundColor: 'rgba(187, 134, 252, 0.1)', color: 'var(--accent-color)', padding: '2px 8px', borderRadius: '12px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ display: 'inline-block', width: '6px', height: '6px', backgroundColor: 'var(--accent-color)', borderRadius: '50%', animation: 'pulse 2s infinite' }}></span>
                {liveCounts[post.id]} viewing
              </span>
            )}
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