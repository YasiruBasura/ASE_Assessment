import React from 'react';

function DeleteConfirmationModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null; // Don't render anything if it's closed

  return (
    <div style={{ 
      position: 'fixed', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      backgroundColor: 'rgba(0, 0, 0, 0.7)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      zIndex: 1000 // Ensures it sits on top of everything else
    }}>
      <div style={{ 
        backgroundColor: 'var(--surface-color)', 
        padding: '30px', 
        borderRadius: '8px', 
        maxWidth: '400px', 
        width: '90%',
        textAlign: 'center', 
        border: '1px solid var(--border-color)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }}>
        
        <h3 style={{ color: '#cf6679', marginTop: 0, fontSize: '1.5rem' }}>⚠️ Delete Post?</h3>
        
        <p style={{ color: 'var(--text-secondary)', lineHeight: '1.6', marginBottom: '30px' }}>
          Are you sure you want to delete this post? <br/><br/>
          <strong style={{ color: 'white' }}>This action cannot be undone.</strong> All post details, 
          along with the entire comment history, will be permanently erased from the site.
        </p>

        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
          <button 
            onClick={onClose} 
            style={{ 
              backgroundColor: 'transparent', 
              border: '1px solid var(--border-color)', 
              color: 'white', 
              padding: '10px 20px',
              flex: 1
            }}
          >
            Cancel
          </button>
          
          <button 
            onClick={onConfirm} 
            style={{ 
              backgroundColor: '#cf6679', 
              color: 'white', 
              border: 'none', 
              padding: '10px 20px',
              flex: 1
            }}
          >
            Delete Forever
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmationModal;