import React, { useState, useEffect } from 'react';
import RecipeCard from './RecipeCard';
import { FileTextIcon, CameraIcon, ClockIcon, CheckIcon, CloseIcon, SearchIcon, FridgeIcon } from './Icons';

export default function IngredientMatcher({ recipes, onViewRecipe }) {
  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [currentInput, setCurrentInput] = useState('');
  
  // File upload state
  const [fileDragActive, setFileDragActive] = useState(false);
  
  // AI Scanner states
  const [scanDragActive, setScanDragActive] = useState(false);
  const [scanImage, setScanImage] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [scanStatus, setScanStatus] = useState('');
  const [scannedResult, setScannedResult] = useState(false);

  // Match calculations
  const [matchedRecipes, setMatchedRecipes] = useState([]);

  // Auto-run matcher when ingredients list changes
  useEffect(() => {
    if (selectedIngredients.length === 0) {
      setMatchedRecipes([]);
      return;
    }

    const matches = recipes.map(recipe => {
      const recipeIngredients = recipe.ingredients.map(i => i.toLowerCase().trim());
      
      const matching = recipeIngredients.filter(ing => 
        selectedIngredients.some(sel => ing.includes(sel.toLowerCase().trim()) || sel.toLowerCase().trim().includes(ing))
      );
      
      const missing = recipeIngredients.filter(ing => 
        !selectedIngredients.some(sel => ing.includes(sel.toLowerCase().trim()) || sel.toLowerCase().trim().includes(ing))
      );

      const matchPercent = Math.round((matching.length / recipeIngredients.length) * 100);

      return {
        ...recipe,
        matching,
        missing,
        matchPercent
      };
    })
    .filter(r => r.matching.length > 0) // only show recipes with at least 1 match
    .sort((a, b) => b.matchPercent - a.matchPercent || b.stars - a.stars);

    setMatchedRecipes(matches);
  }, [selectedIngredients, recipes]);

  // Handle manual tag addition
  const handleAddTag = (e) => {
    e.preventDefault();
    const val = currentInput.trim().toLowerCase();
    if (val && !selectedIngredients.includes(val)) {
      setSelectedIngredients([...selectedIngredients, val]);
      setCurrentInput('');
    }
  };

  const handleRemoveTag = (tag) => {
    setSelectedIngredients(selectedIngredients.filter(t => t !== tag));
  };

  const handleClearAll = () => {
    setSelectedIngredients([]);
    setScanImage(null);
    setScannedResult(false);
  };

  // Handle Text File Upload
  const processTextFile = (file) => {
    if (window.gtag) {
      window.gtag('event', 'fridge_list_upload', {
        event_category: 'fridge_matcher',
        file_name: file.name
      });
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      // Split on commas, newlines, semicolons
      const items = text.split(/[\n,;]+/).map(i => i.trim().toLowerCase()).filter(i => i.length > 0);
      
      // Merge unique ingredients
      const merged = [...selectedIngredients];
      items.forEach(item => {
        if (!merged.includes(item)) {
          merged.push(item);
        }
      });
      setSelectedIngredients(merged);
    };
    reader.readAsText(file);
  };

  // Handle Drag Events for Text File
  const handleDragFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setFileDragActive(true);
    } else if (e.type === "dragleave") {
      setFileDragActive(false);
    }
  };

  const handleDropFile = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFileDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processTextFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      processTextFile(e.target.files[0]);
    }
  };

  // Handle Simulated AI Image Scanner
  const handleDragScan = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setScanDragActive(true);
    } else if (e.type === "dragleave") {
      setScanDragActive(false);
    }
  };

  const handleDropScan = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setScanDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      triggerScan(e.dataTransfer.files[0]);
    }
  };

  const handleScanInputChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      triggerScan(e.target.files[0]);
    }
  };

  const triggerScan = (file) => {
    if (window.gtag) {
      window.gtag('event', 'fridge_image_scan_start', {
        event_category: 'fridge_matcher'
      });
    }

    const url = URL.createObjectURL(file);
    setScanImage(url);
    setScanning(true);
    setScannedResult(false);
    
    // Cognitive log sequence simulation
    const statuses = [
      "Analyzing image structure...",
      "Detecting refrigerator contents...",
      "Identifying vegetable layers & protein bounds...",
      "Translating image features to culinary terms...",
      "Finalizing extraction lists..."
    ];

    let currentStep = 0;
    setScanStatus(statuses[0]);

    const interval = setInterval(() => {
      currentStep++;
      if (currentStep < statuses.length) {
        setScanStatus(statuses[currentStep]);
      } else {
        clearInterval(interval);
        finalizeExtraction();
      }
    }, 550);
  };

  const finalizeExtraction = () => {
    setScanning(false);
    setScannedResult(true);

    // Mock extraction based on recipes so we guarantee matching
    const mockExtractions = [
      "chicken breast",
      "plain yogurt",
      "garlic paste",
      "butter",
      "tomato puree",
      "heavy cream",
      "spaghetti",
      "pecorino romano cheese",
      "black pepper"
    ];

    // Select random subset of 4-6 ingredients to simulate real AI scan
    const shuffled = [...mockExtractions].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, Math.floor(Math.random() * 3) + 4);

    if (window.gtag) {
      window.gtag('event', 'fridge_image_scan_success', {
        event_category: 'fridge_matcher',
        extracted_count: selected.length,
        extracted_items: selected.join(', ')
      });
    }

    const merged = [...selectedIngredients];
    selected.forEach(item => {
      if (!merged.includes(item)) {
        merged.push(item);
      }
    });
    setSelectedIngredients(merged);
  };

  return (
    <div className="animate-slide" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Intro Banner */}
      <div className="glass-panel" style={{ padding: '2rem 2.5rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{
          position: 'absolute',
          top: '-50px',
          right: '-50px',
          width: '250px',
          height: '250px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 163, 115, 0.1) 0%, rgba(212, 163, 115, 0) 70%)',
          pointerEvents: 'none'
        }} />
        <h1 style={{ fontSize: '2rem', color: 'var(--text-primary)', margin: 0 }}>Fridge Ingredient Matcher</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', margin: '0.4rem 0 0', maxWidth: '750px' }}>
          Upload a list of ingredients, select them manually, or take a picture of your fridge to instantly see which recipes you can cook, and find out what's missing.
        </p>
      </div>

      {/* Grid Inputs Area */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        
        {/* Left Input Card: Tags Builder & Text File Uploader */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Tag Builder */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              1. Add Ingredients
            </h2>
            
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="e.g. Chicken, Tomato, Pasta" 
                value={currentInput}
                onChange={(e) => setCurrentInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag(e);
                  }
                }}
                style={{ flexGrow: 1 }}
              />
              <button className="btn-primary" onClick={handleAddTag} style={{ borderRadius: 'var(--radius-sm)', padding: '0.75rem 1.25rem' }}>
                Add
              </button>
            </div>

            {/* Currently Selected Ingredients Display */}
            <div style={{ minHeight: '100px', border: '1px dashed var(--border-color)', borderRadius: 'var(--radius-md)', padding: '1rem', marginTop: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem', alignContent: 'flex-start' }}>
              {selectedIngredients.length > 0 ? (
                selectedIngredients.map((tag, idx) => (
                  <span 
                    key={idx} 
                    style={{
                      background: 'rgba(164, 120, 100, 0.12)',
                      border: '1px solid var(--border-color)',
                      color: 'var(--text-primary)',
                      padding: '0.3rem 0.75rem',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.85rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}
                  >
                    {tag}
                    <button 
                      type="button" 
                      onClick={() => handleRemoveTag(tag)}
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
                <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', width: '100%', textAlign: 'center', alignSelf: 'center' }}>
                  No ingredients added yet. Add tags above, upload a text list, or scan an image of your fridge.
                </div>
              )}
            </div>

            {selectedIngredients.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button className="btn-secondary" onClick={handleClearAll} style={{ padding: '0.4rem 0.9rem', fontSize: '0.8rem' }}>
                  Clear All Ingredients
                </button>
              </div>
            )}
          </div>

          {/* Text/List Upload Dragzone */}
          <div className="glass-panel" style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              2. Upload Ingredient List (.txt)
            </h2>
            
            <div 
              onDragEnter={handleDragFile}
              onDragOver={handleDragFile}
              onDragLeave={handleDragFile}
              onDrop={handleDropFile}
              style={{
                border: '2px dashed var(--border-color)',
                borderColor: fileDragActive ? 'var(--color-accent)' : 'var(--border-color)',
                background: fileDragActive ? 'rgba(164, 120, 100, 0.05)' : 'transparent',
                borderRadius: 'var(--radius-md)',
                padding: '2rem 1rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              onClick={() => document.getElementById('text-file-input').click()}
            >
              <input 
                type="file" 
                id="text-file-input" 
                accept=".txt,.json,.csv"
                style={{ display: 'none' }}
                onChange={handleFileInputChange}
              />
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <FileTextIcon size={30} color="var(--color-accent)" />
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '600', margin: '0 0 0.25rem 0' }}>
                Drag and drop a list file here
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                Supports comma-separated or line-by-line ingredients.
              </p>
            </div>
          </div>

        </div>

        {/* Right Input Card: AI Fridge Photo Scanner */}
        <div className="glass-panel" style={{ padding: '2rem', position: 'relative' }}>
          <h2 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
            3. AI Fridge Scanner
          </h2>
          
          {!scanImage && (
            <div 
              onDragEnter={handleDragScan}
              onDragOver={handleDragScan}
              onDragLeave={handleDragScan}
              onDrop={handleDropScan}
              style={{
                border: '2px dashed var(--border-color)',
                borderColor: scanDragActive ? 'var(--color-accent)' : 'var(--border-color)',
                background: scanDragActive ? 'rgba(164, 120, 100, 0.05)' : 'transparent',
                borderRadius: 'var(--radius-md)',
                padding: '3rem 1rem',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)'
              }}
              onClick={() => document.getElementById('scan-image-input').click()}
            >
              <input 
                type="file" 
                id="scan-image-input" 
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleScanInputChange}
              />
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
                <CameraIcon size={36} color="var(--color-accent)" />
              </div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', fontWeight: '600', margin: '0 0 0.25rem 0' }}>
                Upload or Drop Fridge Photo
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>
                We'll scan the items and add identified ingredients automatically.
              </p>
            </div>
          )}

          {scanImage && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative' }}>
              
              {/* Image Preview Window */}
              <div style={{ position: 'relative', width: '100%', paddingTop: '65%', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <img 
                  src={scanImage} 
                  alt="Fridge Contents" 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover' }}
                />

                {/* Glowing Scanning Overlay */}
                {scanning && (
                  <>
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      background: 'rgba(164, 120, 100, 0.1)'
                    }} />
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '4px',
                      background: 'var(--grad-primary)',
                      boxShadow: '0 0 15px #a47864, 0 0 30px #d4a373',
                      animation: 'scanLine 2.5s ease-in-out infinite'
                    }} />
                  </>
                )}
              </div>

              {/* Scan Status Logs */}
              {scanning && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem', padding: '0.5rem', background: 'rgba(27,18,15,0.3)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-sm)' }}>
                  <ClockIcon size={13} color="var(--color-accent)" />
                  <span style={{ fontSize: '0.85rem', color: 'var(--color-accent)', fontWeight: '600' }} className="animate-fade">
                    {scanStatus}
                  </span>
                </div>
              )}

              {scannedResult && (
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', padding: '0.75rem 1rem', background: 'rgba(143, 156, 127, 0.12)', border: '1px solid rgba(143, 156, 127, 0.25)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
                  <div style={{ color: 'var(--color-success)', display: 'flex', alignItems: 'center', height: '18px' }}>
                    <CheckIcon size={14} color="var(--color-success)" />
                  </div>
                  <div>
                    <span style={{ color: 'var(--color-success)', fontWeight: '600', display: 'block', marginBottom: '0.2rem' }}>
                      Fridge analysis complete!
                    </span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      Extracted ingredients have been merged into your active ingredient tags list.
                    </span>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn-secondary" 
                  onClick={() => {
                    setScanImage(null);
                    setScannedResult(false);
                  }}
                  style={{ flexGrow: 1, padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  Clear Photo
                </button>
                <button 
                  className="btn-primary" 
                  onClick={() => triggerScan(new File([], 'fridge.png'))} // just re-trigger
                  disabled={scanning}
                  style={{ flexGrow: 1, padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                >
                  {scanning ? 'Scanning...' : 'Scan Again'}
                </button>
              </div>

            </div>
          )}

          {/* Scanning Line Keyframes Styling Injection */}
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes scanLine {
              0% { top: 0%; }
              50% { top: 100%; }
              100% { top: 0%; }
            }
          `}} />

        </div>

      </div>

      {/* Matching Results Grid */}
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.4rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem', marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
          Matched Recipes ({matchedRecipes.length})
        </h2>

        {selectedIngredients.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
            <FridgeIcon size={44} color="var(--text-muted)" />
            <div>
              <p style={{ fontSize: '1.05rem', fontWeight: '600', margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>Ready to Match Recipes</p>
              <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--text-secondary)' }}>
                Add ingredients in the section above to find corresponding recipes and see what you can cook.
              </p>
            </div>
          </div>
        ) : matchedRecipes.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', color: 'var(--text-muted)' }}>
            <SearchIcon size={44} color="var(--text-muted)" />
            <div>
              <p style={{ fontSize: '1.05rem', fontWeight: '600', margin: '0 0 0.25rem 0', color: 'var(--text-primary)' }}>No Matches Found</p>
              <p style={{ fontSize: '0.9rem', margin: 0, color: 'var(--text-secondary)' }}>
                We couldn't find any recipes containing your ingredients. Try adding more general items like "chicken", "garlic", or "pasta".
              </p>
            </div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
            {matchedRecipes.map(recipe => (
              <div key={recipe.id} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', background: 'rgba(27, 18, 15, 0.3)', padding: '0.5rem', transition: 'all var(--transition-normal)' }}>
                
                {/* Match percentage and stats header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.5rem 0 0.5rem' }}>
                  <span style={{ 
                    fontSize: '0.85rem', 
                    fontWeight: '700', 
                    color: recipe.matchPercent > 70 ? 'var(--color-success)' : 'var(--color-accent)',
                    backgroundColor: recipe.matchPercent > 70 ? 'rgba(143, 156, 127, 0.12)' : 'rgba(212, 163, 115, 0.12)',
                    padding: '0.25rem 0.5rem',
                    borderRadius: 'var(--radius-sm)',
                    border: recipe.matchPercent > 70 ? '1px solid rgba(143,156,127,0.2)' : '1px solid rgba(212,163,115,0.2)'
                  }}>
                    {recipe.matchPercent}% Match
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {recipe.matching.length} of {recipe.ingredients.length} ingredients
                  </span>
                </div>

                {/* Normal Card */}
                <div style={{ flexGrow: 1 }}>
                  <RecipeCard recipe={recipe} onClick={() => onViewRecipe(recipe.id)} />
                </div>

                {/* Ingredient details match layout */}
                <div style={{ padding: '0 0.5rem 0.5rem 0.5rem', fontSize: '0.8rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <div>
                    <span style={{ color: 'var(--color-success)', fontWeight: '600' }}>Matched: </span>
                    <span style={{ color: 'var(--text-secondary)' }}>
                      {recipe.matching.join(', ')}
                    </span>
                  </div>
                  {recipe.missing.length > 0 && (
                    <div>
                      <span style={{ color: '#bd5d38', fontWeight: '600' }}>Missing: </span>
                      <span style={{ color: 'var(--text-muted)' }}>
                        {recipe.missing.join(', ')}
                      </span>
                    </div>
                  )}
                </div>

              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
