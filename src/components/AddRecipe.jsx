import React, { useState } from 'react';
import { CloseIcon, CheckIcon } from './Icons';

const popularCountries = {
  "India": ["Punjab", "Kerala", "Sichuan", "Maharashtra", "Tamil Nadu", "Delhi", "Bengal"],
  "Italy": ["Lazio", "Tuscany", "Sicily", "Lombardy", "Veneto", "Emilia-Romagna"],
  "Mexico": ["Puebla", "Oaxaca", "Jalisco", "Yucatan", "Chihuahua"],
  "United States": ["Massachusetts", "California", "New York", "Texas", "Louisiana", "Florida"],
  "Japan": ["Tokyo", "Hokkaido", "Kyoto", "Osaka", "Okinawa"],
  "Other": []
};

export default function AddRecipe({ onAddRecipe, onCancel }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [country, setCountry] = useState('India');
  const [state, setState] = useState('');
  const [customCountry, setCustomCountry] = useState('');
  const [customState, setCustomState] = useState('');
  const [spiceLevel, setSpiceLevel] = useState('medium');
  const [cookTime, setCookTime] = useState(30);
  const [stars, setStars] = useState(5);
  const [image, setImage] = useState('');
  
  // Ingredients list builder
  const [ingredients, setIngredients] = useState([]);
  const [currentIngredient, setCurrentIngredient] = useState('');

  // Steps builder
  const [steps, setSteps] = useState([
    { title: 'Prep Ingredients', text: 'Wash, chop, and measure all your ingredients.' }
  ]);

  // Video attachment
  const [videoType, setVideoType] = useState('url'); // 'url' or 'file'
  const [videoUrl, setVideoUrl] = useState('');
  const [videoFile, setVideoFile] = useState(null);

  // Custom sections
  const [sections, setSections] = useState([]);
  const [secTitle, setSecTitle] = useState('');
  const [secContent, setSecContent] = useState('');

  // Form submission feedback
  const [success, setSuccess] = useState(false);

  const handleAddIngredient = (e) => {
    e.preventDefault();
    const trimmed = currentIngredient.trim().toLowerCase();
    if (trimmed && !ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
      setCurrentIngredient('');
    }
  };

  const handleRemoveIngredient = (ing) => {
    setIngredients(ingredients.filter(i => i !== ing));
  };

  const handleAddStep = () => {
    setSteps([...steps, { title: '', text: '' }]);
  };

  const handleUpdateStep = (index, field, value) => {
    const updated = [...steps];
    updated[index][field] = value;
    setSteps(updated);
  };

  const handleRemoveStep = (index) => {
    if (steps.length <= 1) return;
    setSteps(steps.filter((_, idx) => idx !== index));
  };

  const handleAddSection = (e) => {
    e.preventDefault();
    if (secTitle.trim() && secContent.trim()) {
      setSections([...sections, { title: secTitle.trim(), content: secContent.trim() }]);
      setSecTitle('');
      setSecContent('');
    }
  };

  const handleRemoveSection = (index) => {
    setSections(sections.filter((_, idx) => idx !== index));
  };

  const handleVideoFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create local URL for video playback
      const localUrl = URL.createObjectURL(file);
      setVideoFile(localUrl);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (ingredients.length === 0) {
      alert('Please add at least one ingredient.');
      return;
    }
    const emptyStep = steps.some(s => !s.title.trim() || !s.text.trim());
    if (emptyStep) {
      alert('Please fill out all steps titles and instructions.');
      return;
    }

    const finalCountry = country === 'Other' ? customCountry.trim() : country;
    const finalState = (country === 'Other' || state === 'Other') ? customState.trim() : state;

    const newRecipe = {
      id: title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      title,
      description,
      country: finalCountry || 'Global',
      state: finalState || '',
      spiceLevel,
      cookTime: parseInt(cookTime),
      stars: parseFloat(stars),
      image: image.trim() || 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?auto=format&fit=crop&q=80&w=800',
      videoUrl: videoType === 'url' ? videoUrl : '',
      videoFile: videoType === 'file' ? videoFile : null,
      ingredients,
      steps: steps.map((s, idx) => ({ ...s, number: idx + 1 })),
      sections,
      reviews: []
    };

    onAddRecipe(newRecipe);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onCancel(); // return to explore
    }, 1500);
  };

  return (
    <div className="animate-slide" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Header Panel */}
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem' }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', color: 'var(--text-primary)', margin: 0 }}>Add New Recipe</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>Share your culinary creation with the RecipeMaster community.</p>
        </div>
        <button className="btn-secondary" onClick={onCancel}>Cancel</button>
      </div>

      {success && (
        <div style={{
          backgroundColor: 'rgba(143, 156, 127, 0.15)',
          color: 'var(--color-success)',
          border: '1px solid rgba(143, 156, 127, 0.25)',
          padding: '1.25rem',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          fontSize: '1.1rem',
          fontWeight: '600'
        }}>
          <CheckIcon size={20} color="var(--color-success)" />
          Recipe "{title}" added successfully! Redirecting to Explore page...
        </div>
      )}

      {/* Form Container */}
      <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        
        {/* Left Form Panel: General Details */}
        <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <h2 style={{ fontSize: '1.3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', margin: 0 }}>General Details</h2>
          
          <div className="form-group">
            <label className="form-label" htmlFor="recipe-title">Recipe Title *</label>
            <input 
              type="text" 
              id="recipe-title"
              className="form-input" 
              placeholder="e.g. Creamy Chicken Tikka Masala" 
              required 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="recipe-desc">Short Description *</label>
            <textarea 
              id="recipe-desc"
              className="form-textarea" 
              rows="3" 
              placeholder="Give a quick overview of what makes this recipe unique..." 
              required 
              value={description} 
              onChange={(e) => setDescription(e.target.value)} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="recipe-cooktime">Cook Time (mins) *</label>
              <input 
                type="number" 
                id="recipe-cooktime"
                className="form-input" 
                min="1" 
                required 
                value={cookTime} 
                onChange={(e) => setCookTime(e.target.value)} 
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="recipe-stars">Review Rating (1-5) *</label>
              <input 
                type="number" 
                id="recipe-stars"
                className="form-input" 
                min="1" 
                max="5" 
                step="0.1" 
                required 
                value={stars} 
                onChange={(e) => setStars(e.target.value)} 
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="recipe-spice">Spice Level *</label>
            <select 
              id="recipe-spice"
              className="form-select" 
              value={spiceLevel} 
              onChange={(e) => setSpiceLevel(e.target.value)}
            >
              <option value="mild">Mild (Little to no heat)</option>
              <option value="medium">Medium (Pleasantly warm)</option>
              <option value="hot">Hot (Authentic Kick)</option>
              <option value="insane">Insane (Tongue Numbing)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="recipe-country">Country Origin</label>
            <select 
              id="recipe-country"
              className="form-select" 
              value={country} 
              onChange={(e) => {
                setCountry(e.target.value);
                setState(popularCountries[e.target.value]?.[0] || '');
              }}
            >
              {Object.keys(popularCountries).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {country === 'Other' ? (
            <div className="form-group">
              <label className="form-label" htmlFor="custom-country">Specify Country Name *</label>
              <input 
                type="text" 
                id="custom-country"
                className="form-input" 
                placeholder="e.g. Thailand" 
                required 
                value={customCountry} 
                onChange={(e) => setCustomCountry(e.target.value)} 
              />
            </div>
          ) : null}

          {country !== 'Other' && popularCountries[country]?.length > 0 ? (
            <div className="form-group">
              <label className="form-label" htmlFor="recipe-state">State / Region</label>
              <select 
                id="recipe-state"
                className="form-select" 
                value={state} 
                onChange={(e) => setState(e.target.value)}
              >
                {popularCountries[country].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
                <option value="Other">Other...</option>
              </select>
            </div>
          ) : null}

          {(country === 'Other' || state === 'Other') && (
            <div className="form-group">
              <label className="form-label" htmlFor="custom-state">Specify State / Region *</label>
              <input 
                type="text" 
                id="custom-state"
                className="form-input" 
                placeholder="e.g. Chiang Mai" 
                required 
                value={customState} 
                onChange={(e) => setCustomState(e.target.value)} 
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="recipe-image">Image URL</label>
            <input 
              type="url" 
              id="recipe-image"
              className="form-input" 
              placeholder="e.g. https://images.unsplash.com/photo-..." 
              value={image} 
              onChange={(e) => setImage(e.target.value)} 
            />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Leave blank to use a fallback culinary cover.</span>
          </div>

        </div>

        {/* Middle Form Panel: Ingredients & Videos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Ingredients Builder */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h2 style={{ fontSize: '1.3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', margin: 0 }}>Ingredients *</h2>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Add ingredient (e.g. Garlic, Chicken)" 
                value={currentIngredient}
                onChange={(e) => setCurrentIngredient(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddIngredient(e);
                  }
                }}
                style={{ flexGrow: 1 }}
              />
              <button className="btn-primary" onClick={handleAddIngredient} style={{ borderRadius: 'var(--radius-sm)', padding: '0.75rem 1.25rem' }}>
                Add
              </button>
            </div>

            {/* List of currently added ingredient tags */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
              {ingredients.length > 0 ? (
                ingredients.map((ing, idx) => (
                  <span 
                    key={idx} 
                    style={{
                      background: 'rgba(164, 120, 100, 0.12)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      padding: '0.3rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.85rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    {ing}
                    <button 
                      type="button"
                      onClick={() => handleRemoveIngredient(ing)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        color: 'var(--text-muted)', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <CloseIcon size={10} color="var(--text-muted)" />
                    </button>
                  </span>
                ))
              ) : (
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>No ingredients added yet. At least one required.</span>
              )}
            </div>
          </div>

          {/* Videos Attachment */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h2 style={{ fontSize: '1.3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', margin: 0 }}>Recipe Video Guide</h2>
            
            <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem', color: videoType === 'url' ? 'var(--color-accent)' : 'var(--text-secondary)' }}>
                <input 
                  type="radio" 
                  name="videoType" 
                  checked={videoType === 'url'} 
                  onChange={() => setVideoType('url')}
                  style={{ accentColor: 'var(--color-accent)' }}
                />
                Video URL Link
              </label>
              
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.9rem', color: videoType === 'file' ? 'var(--color-accent)' : 'var(--text-secondary)' }}>
                <input 
                  type="radio" 
                  name="videoType" 
                  checked={videoType === 'file'} 
                  onChange={() => setVideoType('file')}
                  style={{ accentColor: 'var(--color-accent)' }}
                />
                Upload Video File
              </label>
            </div>

            {videoType === 'url' ? (
              <div className="form-group">
                <label className="form-label" htmlFor="recipe-videourl">YouTube / Video Embed Link</label>
                <input 
                  type="url" 
                  id="recipe-videourl"
                  className="form-input" 
                  placeholder="e.g. https://www.youtube.com/watch?v=..." 
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                />
              </div>
            ) : (
              <div className="form-group">
                <label className="form-label" htmlFor="recipe-videofile">Select Local Video File</label>
                <input 
                  type="file" 
                  id="recipe-videofile"
                  accept="video/*" 
                  className="form-input" 
                  onChange={handleVideoFileChange} 
                />
                {videoFile && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--color-success)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <CheckIcon size={12} color="var(--color-success)" />
                    <span>Video file linked in memory</span>
                  </div>
                )}
              </div>
            )}
          </div>

        </div>

        {/* Right Form Panel: Steps & Sections */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Steps Builder */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
              <h2 style={{ fontSize: '1.3rem', margin: 0 }}>Cooking Steps *</h2>
              <button type="button" className="btn-secondary" onClick={handleAddStep} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                + Add Step
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
              {steps.map((step, idx) => (
                <div key={idx} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.01)', position: 'relative' }}>
                  
                  {/* Remove step button */}
                  {steps.length > 1 && (
                    <button 
                      type="button" 
                      onClick={() => handleRemoveStep(idx)}
                      style={{ position: 'absolute', top: '10px', right: '10px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem' }}
                      onMouseEnter={(e) => e.target.style.color = '#ef4444'}
                      onMouseLeave={(e) => e.target.style.color = 'var(--text-muted)'}
                    >
                      Remove
                    </button>
                  )}

                  <h3 style={{ fontSize: '0.9rem', color: 'var(--color-accent)', marginBottom: '0.75rem' }}>Step {idx + 1}</h3>

                  <div className="form-group" style={{ marginBottom: '0.75rem' }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Step Header Title *</label>
                    <input 
                      type="text" 
                      className="form-input" 
                      placeholder="e.g. Sauté Aromatics" 
                      required
                      value={step.title}
                      onChange={(e) => handleUpdateStep(idx, 'title', e.target.value)}
                    />
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ fontSize: '0.75rem' }}>Step Directions *</label>
                    <textarea 
                      className="form-textarea" 
                      rows="2" 
                      placeholder="e.g. Cook diced onions and celery until transparent..." 
                      required
                      value={step.text}
                      onChange={(e) => handleUpdateStep(idx, 'text', e.target.value)}
                    />
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* Custom Sections Builder */}
          <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <h2 style={{ fontSize: '1.3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', margin: 0 }}>Extra Info Sections (Optional)</h2>
            
            <div style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'rgba(255,255,255,0.01)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Section Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Serving Suggestion" 
                  value={secTitle}
                  onChange={(e) => setSecTitle(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Section Details</label>
                <textarea 
                  className="form-textarea" 
                  rows="2" 
                  placeholder="e.g. Top with freshly chopped parsley and serve with toasted garlic bread." 
                  value={secContent}
                  onChange={(e) => setSecContent(e.target.value)}
                />
              </div>

              <div>
                <button type="button" className="btn-secondary" onClick={handleAddSection} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
                  + Add Custom Section
                </button>
              </div>
            </div>

            {/* List of currently added sections */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {sections.map((sec, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                  <span style={{ fontWeight: '600' }}>{sec.title}</span>
                  <button type="button" onClick={() => handleRemoveSection(idx)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem' }}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>

      </form>

      {/* Form Submission Footer Actions */}
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', padding: '1.5rem 2rem' }}>
        <button type="button" className="btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className="btn-primary" onClick={handleSubmit}>
          Publish Recipe
        </button>
      </div>

    </div>
  );
}
