import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('username');

  const handleLogout = () => {
    // Clear the JWT token and username from the browser
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    
    // Redirect to the home page and force a refresh to update the UI
    navigate('/');
    window.location.reload(); 
  };

  return (
    <nav style={{ 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center', 
      padding: '15px 40px', 
      backgroundColor: 'var(--surface-color)', 
      borderBottom: '1px solid var(--border-color)',
      marginBottom: '30px'
    }}>
      {/* Left side: App Logo / Home Link */}
      <Link to="/" style={{ textDecoration: 'none', color: 'var(--accent-color)', fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '1px' }}>
        LiveBlog
      </Link>

      {/* Right side: User Info & Authentication */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        {currentUser ? (
          <>
            <span style={{ color: 'white', fontSize: '1rem' }}>
              Welcome, <strong style={{ color: 'var(--accent-color)' }}>{currentUser}</strong>!
            </span>
            <button 
              onClick={handleLogout} 
              style={{ 
                padding: '6px 16px', 
                backgroundColor: 'transparent', 
                border: '1px solid #cf6679', 
                color: '#cf6679', 
                fontSize: '0.9rem',
                borderRadius: '4px'
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', fontStyle: 'italic' }}>
              Login for post and comment!!
            </span>
            <Link to="/login">
              <button style={{ 
                padding: '6px 20px', 
                backgroundColor: 'var(--accent-color)', 
                color: '#000', 
                border: 'none', 
                fontSize: '0.95rem',
                fontWeight: 'bold',
                borderRadius: '4px'
              }}>
                Login
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;