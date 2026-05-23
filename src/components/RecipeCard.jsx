import React from 'react';
import { StarIcon, SpiceIcon, MapPinIcon, ClockIcon } from './Icons';

export default function RecipeCard({ recipe, onClick }) {
  // Render stars vector
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(<StarIcon key={i} filled={true} size={14} />);
      } else if (i - 0.5 <= rating) {
        stars.push(<StarIcon key={i} filled={true} percent={50} size={14} />);
      } else {
        stars.push(<StarIcon key={i} filled={false} size={14} />);
      }
    }
    return stars;
  };

  // Render spice levels with vector chili flames
  const getSpiceBadge = (level) => {
    const uppercaseLevel = level ? level.toUpperCase() : '';
    return (
      <span className={`badge badge-${level?.toLowerCase()}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
        <SpiceIcon level={level} size={12} />
        {uppercaseLevel}
      </span>
    );
  };

  return (
    <div className="glass-card" onClick={onClick} style={{ cursor: 'pointer' }}>
      
      {/* Image container with spice badge absolute */}
      <div style={{ position: 'relative', width: '100%', paddingTop: '65%', overflow: 'hidden', backgroundColor: 'rgba(27,18,15,0.4)' }}>
        <img 
          src={recipe.image || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800'} 
          alt={recipe.title}
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform var(--transition-slow)'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: '1' }}>
          {getSpiceBadge(recipe.spiceLevel)}
        </div>
      </div>

      {/* Content details */}
      <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flexGrow: '1', gap: '0.6rem' }}>
        
        {/* Geography & Rating Row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <MapPinIcon size={14} color="var(--color-accent)" />
            <span style={{ color: 'var(--text-secondary)', fontWeight: '500' }}>
              {recipe.state ? `${recipe.state}, ` : ''}{recipe.country}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', gap: '2px' }}>
              {renderStars(recipe.stars)}
            </div>
            <span style={{ marginLeft: '4px', fontWeight: '600', color: 'var(--text-primary)' }}>{recipe.stars}</span>
          </div>
        </div>

        {/* Title */}
        <h3 style={{ 
          fontSize: '1.15rem', 
          fontWeight: '700', 
          color: 'var(--text-primary)', 
          lineHeight: '1.3',
          fontFamily: 'var(--font-sans)',
          marginTop: '0.2rem'
        }}>
          {recipe.title}
        </h3>

        {/* Short Description */}
        <p style={{ 
          fontSize: '0.85rem', 
          color: 'var(--text-secondary)', 
          display: '-webkit-box',
          WebkitLineClamp: '2',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          lineHeight: '1.5',
          margin: '0.2rem 0 0.5rem 0'
        }}>
          {recipe.description}
        </p>

        {/* Bottom Time and Action Bar */}
        <div style={{ 
          marginTop: 'auto', 
          paddingTop: '0.75rem', 
          borderTop: '1px solid var(--border-color)', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <ClockIcon size={14} color="var(--text-muted)" />
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
              {recipe.cookTime} mins
            </span>
          </div>

          <span style={{ 
            fontSize: '0.8rem', 
            fontWeight: '600', 
            color: 'var(--color-accent)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.2rem' 
          }}>
            View Recipe
            <span>→</span>
          </span>
        </div>

      </div>

    </div>
  );
}
