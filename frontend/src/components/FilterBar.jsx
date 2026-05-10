import React from 'react';

function FilterBar({ categoryFilter, tagFilter, onCategoryChange, onTagChange, onClearFilters }) {
  return (
    <div style={{ display: 'flex', gap: '15px', marginBottom: '30px', padding: '15px', backgroundColor: 'var(--surface-color)', borderRadius: '8px' }}>
      
      <select 
        value={categoryFilter} 
        onChange={(e) => onCategoryChange(e.target.value)} 
        style={{ padding: '8px', borderRadius: '4px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)' }}
      >
        <option value="">All Categories</option>
        <option value="Technology">Technology</option>
        <option value="Tutorial">Tutorial</option>
        <option value="Opinion">Opinion</option>
        <option value="News">News</option>
        <option value="Lifestyle">Lifestyle</option>
      </select>

      <input 
        type="text" 
        placeholder="Filter by Tag (e.g., react)" 
        value={tagFilter}
        onChange={(e) => onTagChange(e.target.value)}
        style={{ padding: '8px', borderRadius: '4px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)' }}
      />

      {/* Only show the Clear button if a filter is actually active! */}
      {(categoryFilter || tagFilter) && (
        <button 
          onClick={onClearFilters}
          style={{ backgroundColor: 'transparent', color: '#cf6679', border: '1px solid #cf6679', padding: '8px 15px' }}
        >
          Clear Filters
        </button>
      )}
    </div>
  );
}

export default FilterBar;