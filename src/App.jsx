import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ExploreRecipes from './components/ExploreRecipes';
import IngredientMatcher from './components/IngredientMatcher';
import AddRecipe from './components/AddRecipe';
import RecipeDetail from './components/RecipeDetail';

export default function App() {
  // 1. Recipes state (fetched from MongoDB)
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch recipes on startup
  useEffect(() => {
    async function loadRecipes() {
      try {
        setLoading(true);
        const res = await fetch('/api/recipes');
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        setRecipes(data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch recipes from database:", err);
        setError("Unable to connect to the recipes database. Please make sure the MONGODB_URI environment variable is configured correctly.");
      } finally {
        setLoading(false);
      }
    }
    loadRecipes();
  }, []);

  // 2. Active Tab View: 'explore' | 'matcher' | 'add-recipe'
  const [activeTab, setActiveTab] = useState('explore');

  // 3. Selected Recipe for detailed view
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  // 4. Dark/Light Theme state (kept in local storage as it is user-specific)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('recipe_master_theme') || 'dark';
  });

  // Sync theme attribute to HTML element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('recipe_master_theme', theme);
  }, [theme]);

  // =========================================================================
  // Google Analytics (GA4) Dynamic Script Injection & Initialization
  // =========================================================================
  useEffect(() => {
    if (!document.getElementById('ga4-script')) {
      const script = document.createElement('script');
      script.id = 'ga4-script';
      script.async = true;
      script.src = 'https://www.googletagmanager.com/gtag/js?id=G-N35F91XVML';
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function() {
        window.dataLayer.push(arguments);
      };
      window.gtag('js', new Date());
      window.gtag('config', 'G-N35F91XVML');
    }
  }, []);

  // =========================================================================
  // Google Analytics (GA4) Page View Tracking
  // =========================================================================
  useEffect(() => {
    if (window.gtag && !loading && !error) {
      let pagePath = '/explore';
      let pageTitle = 'Explore Recipes';

      if (selectedRecipeId) {
        const currentRecipe = recipes.find(r => r.id === selectedRecipeId);
        const title = currentRecipe ? currentRecipe.title : 'Recipe Details';
        pagePath = `/recipe/${selectedRecipeId}`;
        pageTitle = `Recipe: ${title}`;
      } else {
        switch (activeTab) {
          case 'matcher':
            pagePath = '/matcher';
            pageTitle = 'Fridge Matcher';
            break;
          case 'add-recipe':
            pagePath = '/add-recipe';
            pageTitle = 'Add New Recipe';
            break;
          case 'explore':
          default:
            pagePath = '/explore';
            pageTitle = 'Explore Recipes';
            break;
        }
      }

      // Log virtual pageview to Google Analytics
      window.gtag('config', 'G-N35F91XVML', {
        page_path: pagePath,
        page_title: pageTitle
      });
    }
  }, [activeTab, selectedRecipeId, recipes, loading, error]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Add Recipe Callback (Logs Event + POST to API)
  const handleAddRecipe = async (newRecipe) => {
    if (window.gtag) {
      window.gtag('event', 'add_recipe_success', {
        event_category: 'recipe_creation',
        recipe_id: newRecipe.id,
        recipe_title: newRecipe.title,
        country: newRecipe.country,
        state: newRecipe.state || 'Global',
        spice_level: newRecipe.spiceLevel,
        cook_time: newRecipe.cookTime,
        stars: newRecipe.stars
      });
    }

    // Optimistically update local state for snappy response
    setRecipes(prev => [newRecipe, ...prev]);

    try {
      const res = await fetch('/api/recipes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newRecipe)
      });
      if (!res.ok) throw new Error("Failed to write to database");
      
      const savedRecipe = await res.json();
      // Replace with database-saved object (e.g., if ID was appended for uniqueness)
      setRecipes(prev => prev.map(r => r.id === newRecipe.id ? savedRecipe : r));
    } catch (e) {
      console.error("Failed to save recipe to MongoDB database:", e);
      alert("Database Error: Your recipe was added locally but could not be saved to MongoDB. Please check connection.");
    }
  };

  // Add Review Callback (Logs Event + PUT to API)
  const handleAddReview = async (recipeId, review) => {
    const currentRecipe = recipes.find(r => r.id === recipeId);
    if (currentRecipe && window.gtag) {
      window.gtag('event', 'submit_review', {
        event_category: 'reviews',
        recipe_id: recipeId,
        recipe_title: currentRecipe.title,
        rating: review.rating,
        author: review.author
      });
    }

    // Optimistically update local state
    setRecipes(prevRecipes => {
      return prevRecipes.map(recipe => {
        if (recipe.id === recipeId) {
          const updatedReviews = recipe.reviews ? [...recipe.reviews, review] : [review];
          const sum = updatedReviews.reduce((acc, curr) => acc + curr.rating, 0);
          const avgStars = parseFloat((sum / updatedReviews.length).toFixed(1));
          return {
            ...recipe,
            reviews: updatedReviews,
            stars: avgStars
          };
        }
        return recipe;
      });
    });

    try {
      const res = await fetch('/api/recipes', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipeId, review })
      });
      if (!res.ok) throw new Error("Failed to write review to database");
    } catch (e) {
      console.error("Failed to save review to MongoDB database:", e);
      alert("Database Error: Your review was submitted locally but could not be saved to MongoDB.");
    }
  };

  // Click handler to open recipe detail (Logs Select Content Clicks)
  const handleViewRecipeDetails = (id) => {
    const clickedRecipe = recipes.find(r => r.id === id);
    if (clickedRecipe && window.gtag) {
      window.gtag('event', 'select_content', {
        content_type: 'recipe',
        item_id: clickedRecipe.id,
        item_name: clickedRecipe.title,
        country: clickedRecipe.country,
        state: clickedRecipe.state || 'Global',
        spice_level: clickedRecipe.spiceLevel,
        cook_time: clickedRecipe.cookTime,
        stars: clickedRecipe.stars
      });
    }
    setSelectedRecipeId(id);
  };

  // Navigation interceptor to reset detailed view and track start clicks
  const handleSetActiveTab = (tab) => {
    setSelectedRecipeId(null); // Close detailed view
    setActiveTab(tab);

    if (tab === 'add-recipe' && window.gtag) {
      window.gtag('event', 'add_recipe_start', {
        event_category: 'recipe_creation',
        event_label: 'User clicked add recipe navigation tab'
      });
    }
  };

  // Find selected recipe object
  const selectedRecipe = recipes.find(r => r.id === selectedRecipeId);

  // Main Render View Router
  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', gap: '1rem' }} className="glass-panel">
          <div className="loader" style={{
            width: '40px',
            height: '40px',
            border: '4px solid rgba(164, 120, 100, 0.12)',
            borderTop: '4px solid var(--color-accent)',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <span style={{ color: 'var(--text-secondary)', fontWeight: '600' }}>Connecting to Database...</span>
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}} />
        </div>
      );
    }

    if (error) {
      return (
        <div style={{ padding: '3rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem' }} className="glass-panel">
          <span style={{ fontSize: '3rem' }}>🔌</span>
          <h2 style={{ fontSize: '1.5rem', color: 'var(--spice-insane)', margin: 0 }}>Database Connection Error</h2>
          <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: 0, lineHeight: '1.5' }}>{error}</p>
          <button className="btn-primary" onClick={() => window.location.reload()} style={{ marginTop: '0.5rem' }}>Retry Connection</button>
        </div>
      );
    }

    if (selectedRecipeId) {
      return (
        <RecipeDetail 
          recipe={selectedRecipe} 
          onBack={() => setSelectedRecipeId(null)} 
          onAddReview={handleAddReview}
        />
      );
    }

    switch (activeTab) {
      case 'matcher':
        return (
          <IngredientMatcher 
            recipes={recipes} 
            onViewRecipe={handleViewRecipeDetails}
          />
        );
      case 'add-recipe':
        return (
          <AddRecipe 
            onAddRecipe={handleAddRecipe} 
            onCancel={() => setActiveTab('explore')}
          />
        );
      case 'explore':
      default:
        return (
          <ExploreRecipes 
            recipes={recipes} 
            onViewRecipe={handleViewRecipeDetails}
          />
        );
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      
      {/* Ambient glowing spots matching Pantone 2025 Mocha Mousse theme */}
      <div className="mocha-ambient ambient-1"></div>
      <div className="mocha-ambient ambient-2"></div>

      {/* Navigation Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={handleSetActiveTab} 
        theme={theme} 
        toggleTheme={toggleTheme} 
      />

      {/* Main Content Area */}
      <main className="app-container" style={{ flexGrow: 1, width: '100%', marginTop: '2rem' }}>
        {renderContent()}
      </main>

      {/* Footer */}
      <footer style={{
        marginTop: 'auto',
        borderTop: '1px solid var(--border-color)',
        padding: '1.5rem',
        textAlign: 'center',
        fontSize: '0.85rem',
        color: 'var(--text-muted)',
        background: 'rgba(27, 18, 15, 0.2)'
      }}>
        <div className="app-container" style={{ padding: 0 }}>
          <p>© 2026 RecipeMaster.com. Designed around Pantone Color of the Year 2025: <b>Mocha Mousse</b>.</p>
        </div>
      </footer>

    </div>
  );
}
