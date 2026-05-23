import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import ExploreRecipes from './components/ExploreRecipes';
import IngredientMatcher from './components/IngredientMatcher';
import AddRecipe from './components/AddRecipe';
import RecipeDetail from './components/RecipeDetail';
import { initialRecipes } from './data/initialRecipes';

export default function App() {
  // 1. Recipes state (hydrated from localStorage or seeded from initialRecipes)
  const [recipes, setRecipes] = useState(() => {
    try {
      const saved = localStorage.getItem('recipe_master_recipes');
      return saved ? JSON.parse(saved) : initialRecipes;
    } catch (e) {
      console.error("Failed to parse recipes from localStorage", e);
      return initialRecipes;
    }
  });

  // Sync recipes to localStorage when updated
  useEffect(() => {
    localStorage.setItem('recipe_master_recipes', JSON.stringify(recipes));
  }, [recipes]);

  // 2. Active Tab View: 'explore' | 'matcher' | 'add-recipe'
  const [activeTab, setActiveTab] = useState('explore');

  // 3. Selected Recipe for detailed view
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);

  // 4. Dark/Light Theme state
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('recipe_master_theme') || 'dark';
  });

  // Sync theme attribute to HTML element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('recipe_master_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Add Recipe Callback
  const handleAddRecipe = (newRecipe) => {
    setRecipes(prev => [newRecipe, ...prev]);
  };

  // Add Review Callback (updates recipe stats in memory)
  const handleAddReview = (recipeId, review) => {
    setRecipes(prevRecipes => {
      return prevRecipes.map(recipe => {
        if (recipe.id === recipeId) {
          const updatedReviews = recipe.reviews ? [...recipe.reviews, review] : [review];
          
          // Recalculate average rating stars (round to 1 decimal place)
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
  };

  // Find selected recipe object
  const selectedRecipe = recipes.find(r => r.id === selectedRecipeId);

  // Navigation interceptor to reset detailed view when switching tabs
  const handleSetActiveTab = (tab) => {
    setSelectedRecipeId(null); // Close detailed view
    setActiveTab(tab);
  };

  // Main Render View Router
  const renderContent = () => {
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
            onViewRecipe={(id) => setSelectedRecipeId(id)}
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
            onViewRecipe={(id) => setSelectedRecipeId(id)}
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
