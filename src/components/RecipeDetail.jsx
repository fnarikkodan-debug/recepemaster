import React, { useState } from 'react';
import { MapPinIcon, SpiceIcon, ClockIcon, StarIcon } from './Icons';

export default function RecipeDetail({ recipe, onBack, onAddReview }) {
  const [checkedIngredients, setCheckedIngredients] = useState({});
  const [checkedSteps, setCheckedSteps] = useState({});
  
  // Review form states
  const [authorName, setAuthorName] = useState('');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!recipe) return <div style={{ color: 'var(--text-primary)', padding: '2rem' }}>Recipe not found.</div>;

  const toggleIngredient = (index) => {
    setCheckedIngredients(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const toggleStep = (index) => {
    setCheckedSteps(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!authorName.trim() || !comment.trim()) return;

    const newReview = {
      author: authorName,
      rating: parseInt(rating),
      comment: comment
    };

    onAddReview(recipe.id, newReview);
    setAuthorName('');
    setRating(5);
    setComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 3000);
  };

  const isYouTubeEmbed = (url) => {
    return url && (url.includes('youtube.com/embed') || url.includes('youtu.be') || url.includes('youtube.com/watch'));
  };

  const getYouTubeEmbedUrl = (url) => {
    if (!url) return '';
    if (url.includes('youtube.com/embed/')) return url;
    // Extract video ID for standard URLs
    let videoId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
  };

  const spiceLabels = {
    mild: 'Mild Heat',
    medium: 'Medium Spice',
    hot: 'Hot & Spicy',
    insane: 'Extreme Heat'
  };

  return (
    <div className="animate-slide" style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginTop: '1rem' }}>
      
      {/* Back Navigation Button */}
      <div>
        <button className="btn-secondary" onClick={onBack} style={{ padding: '0.6rem 1.2rem', gap: '0.4rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Explore
        </button>
      </div>

      {/* Hero Header Glass Section */}
      <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
        
        {/* Ambient background decoration */}
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '200px',
          height: '200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(164, 120, 100, 0.15) 0%, rgba(164, 120, 100, 0) 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
          <span className="badge badge-geo" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPinIcon size={13} color="var(--color-accent)" />
            {recipe.state ? `${recipe.state}, ` : ''}{recipe.country}
          </span>
          <span className={`badge badge-${recipe.spiceLevel}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <SpiceIcon level={recipe.spiceLevel} size={12} />
            {spiceLabels[recipe.spiceLevel] || recipe.spiceLevel}
          </span>
          <span className="badge badge-time" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
            <ClockIcon size={13} color="var(--text-secondary)" />
            {recipe.cookTime} Mins Cooking
          </span>
          <span className="badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', backgroundColor: 'rgba(212, 163, 115, 0.15)', color: '#d4a373', border: '1px solid rgba(212, 163, 115, 0.25)' }}>
            <StarIcon filled={true} size={13} />
            {recipe.stars} Rating
          </span>
        </div>

        <h1 style={{ fontSize: '2.4rem', color: 'var(--text-primary)', margin: '0' }}>{recipe.title}</h1>
        
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '800px', lineHeight: '1.6' }}>
          {recipe.description}
        </p>
      </div>

      {/* Main Content Grid */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', 
        gap: '2rem' 
      }}>
        
        {/* Left Column: Ingredients, Videos & Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Ingredients Checklist */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Ingredients Checklist
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
              Mark the ingredients you have on hand:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recipe.ingredients.map((ing, idx) => (
                <label 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '0.75rem', 
                    cursor: 'pointer',
                    fontSize: '1rem',
                    color: checkedIngredients[idx] ? 'var(--text-muted)' : 'var(--text-secondary)',
                    textDecoration: checkedIngredients[idx] ? 'line-through' : 'none',
                    transition: 'color var(--transition-fast)'
                  }}
                >
                  <input 
                    type="checkbox" 
                    checked={!!checkedIngredients[idx]} 
                    onChange={() => toggleIngredient(idx)}
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '4px',
                      accentColor: 'var(--color-accent)',
                      cursor: 'pointer'
                    }}
                  />
                  {ing}
                </label>
              ))}
            </div>
          </div>

          {/* Video Section */}
          {(recipe.videoUrl || recipe.videoFile) && (
            <div className="glass-panel" style={{ padding: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Recipe Video Demonstration
              </h2>
              <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                {recipe.videoFile ? (
                  // Custom Local Upload Video File
                  <video 
                    src={recipe.videoFile} 
                    controls 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                ) : isYouTubeEmbed(recipe.videoUrl) ? (
                  // YouTube Embed
                  <iframe 
                    src={getYouTubeEmbedUrl(recipe.videoUrl)} 
                    title={`${recipe.title} Video Guide`}
                    frameBorder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  />
                ) : (
                  // Normal external URL
                  <a 
                    href={recipe.videoUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="btn-primary" 
                    style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}
                  >
                    Watch External Video Tutorial
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Custom Sections (e.g. Marinade Details, Notes) */}
          {recipe.sections && recipe.sections.map((section, idx) => (
            <div key={idx} className="glass-panel" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
                {section.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                {section.content}
              </p>
            </div>
          ))}

        </div>

        {/* Right Column: Cooking Steps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              Step-by-Step Guide
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {recipe.steps.map((step, idx) => (
                <div 
                  key={idx} 
                  style={{ 
                    display: 'flex', 
                    gap: '1rem', 
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    background: checkedSteps[idx] ? 'rgba(164, 120, 100, 0.03)' : 'rgba(255,255,255,0.01)',
                    opacity: checkedSteps[idx] ? 0.65 : 1,
                    transition: 'all var(--transition-normal)'
                  }}
                >
                  {/* Checkbox circle indicator */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <button 
                      onClick={() => toggleStep(idx)}
                      style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '50%',
                        border: checkedSteps[idx] ? 'none' : '2px solid var(--border-color)',
                        backgroundColor: checkedSteps[idx] ? 'var(--color-success)' : 'transparent',
                        color: '#fff',
                        fontWeight: '700',
                        fontSize: '0.8rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        transition: 'all var(--transition-fast)'
                      }}
                    >
                      {checkedSteps[idx] ? '✓' : idx + 1}
                    </button>
                  </div>

                  {/* Step instructions */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flexGrow: '1' }}>
                    <h4 style={{ 
                      fontSize: '1.05rem', 
                      fontWeight: '600', 
                      color: checkedSteps[idx] ? 'var(--text-muted)' : 'var(--text-primary)',
                      textDecoration: checkedSteps[idx] ? 'line-through' : 'none'
                    }}>
                      {step.title}
                    </h4>
                    <p style={{ 
                      fontSize: '0.9rem', 
                      color: 'var(--text-secondary)',
                      lineHeight: '1.5'
                    }}>
                      {step.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* Review Section */}
      <div className="glass-panel" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        <h2 style={{ fontSize: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', margin: 0, color: 'var(--text-primary)' }}>
          User Reviews & Ratings
        </h2>

        {/* Existing reviews */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {recipe.reviews && recipe.reviews.length > 0 ? (
            recipe.reviews.map((rev, idx) => (
              <div 
                key={idx} 
                style={{ 
                  padding: '1.25rem', 
                  borderRadius: 'var(--radius-md)', 
                  border: '1px solid var(--border-color)', 
                  background: 'rgba(255,255,255,0.01)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: '600', color: 'var(--text-primary)', fontSize: '0.95rem' }}>{rev.author}</span>
                  <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                    {Array.from({ length: 5 }).map((_, starIdx) => (
                      <StarIcon key={starIdx} filled={starIdx < rev.rating} size={12} />
                    ))}
                  </div>
                </div>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', margin: 0, lineHeight: '1.5' }}>
                  {rev.comment}
                </p>
              </div>
            ))
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', margin: 0 }}>
              No reviews yet. Be the first to share your cooking experience!
            </p>
          )}
        </div>

        {/* Add review form */}
        <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
          
          <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', margin: 0 }}>Add Your Review</h3>

          {reviewSubmitted && (
            <div style={{ 
              backgroundColor: 'rgba(143, 156, 127, 0.15)', 
              color: 'var(--color-success)', 
              border: '1px solid rgba(143, 156, 127, 0.25)', 
              padding: '0.75rem 1rem', 
              borderRadius: 'var(--radius-sm)',
              fontSize: '0.9rem',
              fontWeight: '500'
            }}>
              ✓ Thank you! Your review has been added successfully.
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="review-author">Your Name</label>
              <input 
                type="text" 
                id="review-author"
                className="form-input" 
                required 
                placeholder="e.g. Gordon R." 
                value={authorName} 
                onChange={(e) => setAuthorName(e.target.value)} 
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="review-rating">Rating</label>
              <select 
                id="review-rating"
                className="form-select" 
                value={rating} 
                onChange={(e) => setRating(e.target.value)}
              >
                <option value={5}>★★★★★ (5 Stars)</option>
                <option value={4}>★★★★☆ (4 Stars)</option>
                <option value={3}>★★★☆☆ (3 Stars)</option>
                <option value={2}>★★☆☆☆ (2 Stars)</option>
                <option value={1}>★☆☆☆☆ (1 Star)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="review-comment">Review Comments</label>
            <textarea 
              id="review-comment"
              className="form-textarea" 
              rows="3" 
              required 
              placeholder="How did it turn out? Did you make any changes to the ingredients?" 
              value={comment} 
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div>
            <button type="submit" className="btn-primary">
              Submit Review
            </button>
          </div>

        </form>

      </div>

    </div>
  );
}
