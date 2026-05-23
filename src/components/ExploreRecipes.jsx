import React, { useState, useMemo } from 'react';
import RecipeCard from './RecipeCard';
import { BookIcon, StarIcon, ClockIcon, SpiceIcon, EmptyPlateIcon } from './Icons';

export default function ExploreRecipes({ recipes, onViewRecipe }) {
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState('All');
  const [stateFilter, setStateFilter] = useState('All');
  const [spiceFilter, setSpiceFilter] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All'); // 'All', 'under30', 'under60'
  const [starsFilter, setStarsFilter] = useState('All'); // 'All', '4.5', '4.8'

  // Extract unique countries and states for filter dropdowns
  const countriesList = useMemo(() => {
    const list = new Set();
    recipes.forEach(r => { if (r.country) list.add(r.country); });
    return ['All', ...Array.from(list)];
  }, [recipes]);

  const statesList = useMemo(() => {
    const list = new Set();
    recipes.forEach(r => {
      // Filter states depending on country selection
      if (countryFilter === 'All' || r.country === countryFilter) {
        if (r.state) list.add(r.state);
      }
    });
    return ['All', ...Array.from(list)];
  }, [recipes, countryFilter]);

  // Combined Filters Logic
  const filteredRecipes = useMemo(() => {
    return recipes.filter(recipe => {
      // 1. Search Query Match
      const query = search.toLowerCase().trim();
      const matchesSearch = !query || 
        recipe.title.toLowerCase().includes(query) || 
        recipe.description.toLowerCase().includes(query) ||
        recipe.ingredients.some(i => i.toLowerCase().includes(query));

      // 2. Country Match
      const matchesCountry = countryFilter === 'All' || recipe.country === countryFilter;

      // 3. State Match
      const matchesState = stateFilter === 'All' || recipe.state === stateFilter;

      // 4. Spice Level Match
      const matchesSpice = spiceFilter === 'All' || recipe.spiceLevel?.toLowerCase() === spiceFilter.toLowerCase();

      // 5. Cook Time Match
      let matchesTime = true;
      if (timeFilter === 'under30') matchesTime = recipe.cookTime <= 30;
      else if (timeFilter === 'under60') matchesTime = recipe.cookTime <= 60;

      // 6. Stars Rating Match
      let matchesStars = true;
      if (starsFilter === '4.5') matchesStars = recipe.stars >= 4.5;
      else if (starsFilter === '4.8') matchesStars = recipe.stars >= 4.8;

      return matchesSearch && matchesCountry && matchesState && matchesSpice && matchesTime && matchesStars;
    });
  }, [recipes, search, countryFilter, stateFilter, spiceFilter, timeFilter, starsFilter]);

  // Interactive statistics for the dashboard overview
  const stats = useMemo(() => {
    if (recipes.length === 0) return { count: 0, avgStars: 0, fastest: 0, hotCount: 0 };
    const starsSum = recipes.reduce((sum, r) => sum + r.stars, 0);
    const times = recipes.map(r => r.cookTime);
    const hotCount = recipes.filter(r => r.spiceLevel === 'hot' || r.spiceLevel === 'insane').length;
    return {
      count: recipes.length,
      avgStars: (starsSum / recipes.length).toFixed(1),
      fastest: Math.min(...times),
      hotCount
    };
  }, [recipes]);

  return (
    <div className="animate-fade" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      {/* Search Bar & Ambient Highlights */}
      <div style={{ display: 'flex', position: 'relative', width: '100%' }}>
        <input 
          type="text" 
          placeholder="Search recipes, ingredients, flavor profiles..." 
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: '100%',
            background: 'var(--bg-card)',
            backdropFilter: 'var(--glass-blur)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.1rem 1.5rem 1.1rem 3.5rem',
            color: 'var(--text-primary)',
            fontSize: '1.1rem',
            outline: 'none',
            boxShadow: 'var(--card-glow)',
            transition: 'all var(--transition-fast)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = 'var(--color-accent)';
            e.target.style.boxShadow = '0 0 25px var(--glow-color)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = 'var(--border-color)';
            e.target.style.boxShadow = 'var(--card-glow)';
          }}
        />
        {/* Search Icon */}
        <div style={{ position: 'absolute', left: '1.4rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </div>
      </div>

      {/* Stats Cards Section */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ background: 'rgba(164, 120, 100, 0.1)', padding: '0.6rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookIcon size={20} color="var(--color-accent)" />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: '800', lineHeight: '1.1', color: 'var(--text-primary)' }}>{stats.count}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.03em' }}>Curated Recipes</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ background: 'rgba(164, 120, 100, 0.1)', padding: '0.6rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <StarIcon filled={true} size={20} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: '800', lineHeight: '1.1', color: 'var(--text-primary)' }}>{stats.avgStars}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.03em' }}>Average Rating</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ background: 'rgba(164, 120, 100, 0.1)', padding: '0.6rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ClockIcon size={20} color="var(--color-accent)" />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: '800', lineHeight: '1.1', color: 'var(--text-primary)' }}>{stats.fastest}m</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.03em' }}>Fastest Dish</span>
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1.25rem', borderRadius: 'var(--radius-md)' }}>
          <div style={{ background: 'rgba(164, 120, 100, 0.1)', padding: '0.6rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <SpiceIcon level="hot" size={16} />
          </div>
          <div>
            <span style={{ display: 'block', fontSize: '1.5rem', fontWeight: '800', lineHeight: '1.1', color: 'var(--text-primary)' }}>{stats.hotCount}</span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: '0.03em' }}>Spicy Plates</span>
          </div>
        </div>
      </div>

      {/* Dynamic Filters Section */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
        
        {/* Country */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flexGrow: 1, minWidth: '130px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Country</span>
          <select 
            className="form-select" 
            value={countryFilter} 
            onChange={(e) => {
              setCountryFilter(e.target.value);
              setStateFilter('All'); // Reset state filter when country changes
            }}
            style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
          >
            {countriesList.map(c => <option key={c} value={c}>{c === 'All' ? 'All Countries' : c}</option>)}
          </select>
        </div>

        {/* State */}
        {statesList.length > 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flexGrow: 1, minWidth: '130px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>State / Province</span>
            <select 
              className="form-select" 
              value={stateFilter} 
              onChange={(e) => setStateFilter(e.target.value)}
              style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
            >
              {statesList.map(s => <option key={s} value={s}>{s === 'All' ? 'All States / Regions' : s}</option>)}
            </select>
          </div>
        )}

        {/* Spice Level */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flexGrow: 1, minWidth: '130px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Spice Level</span>
          <select 
            className="form-select" 
            value={spiceFilter} 
            onChange={(e) => setSpiceFilter(e.target.value)}
            style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
          >
            <option value="All">All Heat Levels</option>
            <option value="mild">Mild</option>
            <option value="medium">Medium</option>
            <option value="hot">Hot</option>
            <option value="insane">Insane</option>
          </select>
        </div>

        {/* Cook Time */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flexGrow: 1, minWidth: '130px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Cook Time</span>
          <select 
            className="form-select" 
            value={timeFilter} 
            onChange={(e) => setTimeFilter(e.target.value)}
            style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
          >
            <option value="All">Any Cook Time</option>
            <option value="under30">Under 30 minutes</option>
            <option value="under60">Under 60 minutes</option>
          </select>
        </div>

        {/* Stars / Ratings */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', flexGrow: 1, minWidth: '130px' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Review Rating</span>
          <select 
            className="form-select" 
            value={starsFilter} 
            onChange={(e) => setStarsFilter(e.target.value)}
            style={{ padding: '0.5rem 0.75rem', fontSize: '0.85rem' }}
          >
            <option value="All">Any Rating</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="4.8">4.8+ Stars</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        <div style={{ alignSelf: 'flex-end' }}>
          <button 
            className="btn-secondary" 
            onClick={() => {
              setCountryFilter('All');
              setStateFilter('All');
              setSpiceFilter('All');
              setTimeFilter('All');
              setStarsFilter('All');
              setSearch('');
            }}
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
          >
            Reset Filters
          </button>
        </div>

      </div>

      {/* Grid of Results */}
      <div>
        {filteredRecipes.length > 0 ? (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
            gap: '2rem' 
          }}>
            {filteredRecipes.map(recipe => (
              <div key={recipe.id} className="animate-fade">
                <RecipeCard recipe={recipe} onClick={() => onViewRecipe(recipe.id)} />
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }} className="glass-panel">
            <EmptyPlateIcon size={48} color="var(--text-muted)" />
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: 'var(--text-primary)' }}>No recipes matches your filters</h3>
              <p style={{ fontSize: '0.9rem', margin: '0.25rem 0 0 0', color: 'var(--text-secondary)' }}>Try typing a different keyword or resetting your filter options.</p>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
