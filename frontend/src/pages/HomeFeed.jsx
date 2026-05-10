import React, { useState, useEffect } from 'react';
import { getPosts } from '../services/api';
import { Link } from 'react-router-dom';
import SockJS from 'sockjs-client';
import Stomp from 'stompjs';

// --- ADDED THE NEW COMPONENT IMPORTS ---
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';

function HomeFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [liveCounts, setLiveCounts] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [searchKeyword, setSearchKeyword] = useState('');

  // --- UPDATED TO RE-RUN WHEN FILTERS OR PAGE CHANGES ---
  useEffect(() => {
    fetchPosts();
  }, [currentPage, categoryFilter, tagFilter, searchKeyword]);

  const fetchPosts = async () => {
    try {
      // Pass the dynamic states to your API call
      const data = await getPosts(currentPage, 5, categoryFilter, tagFilter, searchKeyword); 
      setPosts(data.content); 
      setTotalPages(data.totalPages); // Store the total pages from the backend
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  // --- HANDLERS FOR FILTERING ---
  const handleCategoryChange = (newCategory) => {
    setCategoryFilter(newCategory);
    setCurrentPage(0); // Reset to first page on filter change
  };

  const handleTagChange = (newTag) => {
    setTagFilter(newTag);
    setCurrentPage(0); // Reset to first page on filter change
  };

  const handleSearchChange = (newKeyword) => {
    setSearchKeyword(newKeyword);
    setCurrentPage(0);
  };

  const handleClearFilters = () => {
    setCategoryFilter('');
    setTagFilter('');
    setCurrentPage(0); // Reset to first page on filter clear
    setSearchKeyword('');
  };

  // --- WEBSOCKET FOR GLOBAL COUNTS (Unchanged) ---
  useEffect(() => {
    import('../services/api').then(({ getGlobalLiveCounts }) => {
        getGlobalLiveCounts().then(setLiveCounts);
    });

    const socket = new SockJS('http://localhost:8080/ws');
    const stompClient = Stomp.over(socket);
    stompClient.debug = null;

    stompClient.connect({}, () => {
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

      {/* --- INJECTED FILTER BAR --- */}
      <FilterBar 
        categoryFilter={categoryFilter}
        tagFilter={tagFilter}
        searchKeyword={searchKeyword} 
        onCategoryChange={handleCategoryChange}
        onTagChange={handleTagChange}
        onSearchChange={handleSearchChange} 
        onClearFilters={handleClearFilters}
      />
      
      {posts.length === 0 ? (
        <p style={{ marginTop: '20px', color: 'var(--text-secondary)' }}>No posts found.</p>
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

      {/* --- INJECTED PAGINATION --- */}
      <Pagination 
        currentPage={currentPage} 
        totalPages={totalPages} 
        onPageChange={setCurrentPage} 
      />

    </div>
  );
}

export default HomeFeed;