import React from 'react';

function Pagination({ currentPage, totalPages, onPageChange }) {
  // If there's no need for pagination, render nothing!
  if (totalPages <= 1) return null; 

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '20px', marginTop: '40px' }}>
      <button 
        disabled={currentPage === 0} 
        onClick={() => onPageChange(currentPage - 1)}
        style={{ padding: '8px 16px', opacity: currentPage === 0 ? 0.5 : 1 }}
      >
        Previous
      </button>
      
      <span style={{ color: 'var(--text-secondary)' }}>
        Page {currentPage + 1} of {totalPages}
      </span>
      
      <button 
        disabled={currentPage >= totalPages - 1} 
        onClick={() => onPageChange(currentPage + 1)}
        style={{ padding: '8px 16px', opacity: currentPage >= totalPages - 1 ? 0.5 : 1 }}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination;