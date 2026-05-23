import React from 'react';
import { LogoIcon } from './Icons';

export default function Header({ activeTab, setActiveTab, theme, toggleTheme }) {
  return (
    <header className="app-header">
      <div className="app-container" style={{ padding: '1rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '70px' }}>
        
        {/* Logo */}
        <div 
          onClick={() => setActiveTab('explore')} 
          style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer' }}
        >
          <LogoIcon size={30} />
          <span style={{ 
            fontFamily: 'var(--font-sans)', 
            fontWeight: '800', 
            fontSize: '1.4rem', 
            letterSpacing: '-0.04em',
            background: 'var(--grad-primary)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            RecipeMaster
          </span>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button 
            className={`btn-tab ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
            style={getTabStyle(activeTab === 'explore')}
          >
            Explore
          </button>
          
          <button 
            className={`btn-tab ${activeTab === 'matcher' ? 'active' : ''}`}
            onClick={() => setActiveTab('matcher')}
            style={getTabStyle(activeTab === 'matcher')}
          >
            Fridge Matcher
          </button>

          <button 
            className={`btn-tab ${activeTab === 'add-recipe' ? 'active' : ''}`}
            onClick={() => setActiveTab('add-recipe')}
            style={getTabStyle(activeTab === 'add-recipe')}
          >
            + Add Recipe
          </button>
        </nav>

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button 
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            style={{
              background: 'rgba(164, 120, 100, 0.1)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all var(--transition-fast)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(164, 120, 100, 0.2)';
              e.currentTarget.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(164, 120, 100, 0.1)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            {theme === 'dark' ? (
              // Sun Icon
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"></circle>
                <line x1="12" y1="1" x2="12" y2="3"></line>
                <line x1="12" y1="21" x2="12" y2="23"></line>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                <line x1="1" y1="12" x2="3" y2="12"></line>
                <line x1="21" y1="12" x2="23" y2="12"></line>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
              </svg>
            ) : (
              // Moon Icon
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
              </svg>
            )}
          </button>
        </div>

      </div>
    </header>
  );
}

// Helpers
function getTabStyle(isActive) {
  return {
    background: isActive ? 'var(--grad-primary)' : 'transparent',
    color: isActive ? '#fff' : 'var(--text-secondary)',
    border: 'none',
    padding: '0.5rem 1.2rem',
    borderRadius: 'var(--radius-full)',
    fontWeight: '600',
    fontSize: '0.9rem',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
    boxShadow: isActive ? '0 4px 12px rgba(164, 120, 100, 0.25)' : 'none'
  };
}
