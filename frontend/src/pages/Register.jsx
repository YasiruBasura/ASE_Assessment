import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';

function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await registerUser(username, password);
      alert("Registration successful! Please log in.");
      navigate('/login'); // Send them to the login page
    } catch (err) {
      setError(err.response?.data || 'Failed to register. Username might be taken.');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '30px', backgroundColor: 'var(--surface-color)', borderRadius: '8px' }}>
      <h2 style={{ color: 'var(--accent-color)' }}>Create an Account</h2>
      {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      
      <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' }}>
        <input 
          type="text" 
          placeholder="Choose a Username" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'white' }}
        />
        <input 
          type="password" 
          placeholder="Choose a Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ padding: '10px', borderRadius: '4px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'white' }}
        />
        <button type="submit">Sign Up</button>
      </form>

      <p style={{ marginTop: '20px', textAlign: 'center', fontSize: '0.9rem' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--accent-color)' }}>Log in here</Link>
      </p>
    </div>
  );
}

export default Register;