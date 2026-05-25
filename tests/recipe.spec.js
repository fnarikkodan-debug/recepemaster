import { test, expect } from '@playwright/test';

test.describe('RecipeMaster E2E Test Suite', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to homepage before each test
    await page.goto('/');
  });

  test('should load the homepage and display brand logo', async ({ page }) => {
    // Assert page title is correct for SEO
    await expect(page).toHaveTitle(/RecipeMaster/);

    // Verify navigation logo is present in the header
    const logoText = page.locator('header span:has-text("RecipeMaster")');
    await expect(logoText).toBeVisible();

    // Verify initial cards are displayed
    const recipeCards = page.locator('.glass-card');
    await expect(recipeCards.first()).toBeVisible();
    const count = await recipeCards.count();
    expect(count).toBeGreaterThanOrEqual(5);
  });

  test('should filter recipe cards when searching', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search recipes"]');
    await expect(searchInput).toBeVisible();

    // Type "Butter Chicken" to filter
    await searchInput.fill('Butter Chicken');
    
    // Check cards list
    const recipeCards = page.locator('.glass-card');
    await expect(recipeCards).toHaveCount(1); // Only Butter Chicken matches
    await expect(page.locator('text=Classic Butter Chicken')).toBeVisible();
    await expect(page.locator('text=Authentic Cacio e Pepe')).not.toBeVisible();
  });

  test('should navigate to Fridge Matcher tab and perform search', async ({ page }) => {
    // Navigate to Fridge Matcher tab
    const matcherTabButton = page.locator('button:has-text("Fridge Matcher")');
    await matcherTabButton.click();

    // Assert matcher view loads
    const matcherHeader = page.locator('h1:has-text("Fridge Ingredient Matcher")');
    await expect(matcherHeader).toBeVisible();

    // Add manually a tag
    const ingredientInput = page.locator('input[placeholder*="Chicken"]');
    await ingredientInput.fill('spaghetti');
    await page.locator('button.btn-primary:has-text("Add")').click();

    // Verify spaghetti tag is displayed
    const tag = page.locator('span').filter({ hasText: /^spaghetti$/ }).first();
    await expect(tag).toBeVisible();

    // Verify Cacio e Pepe is displayed as a matching recipe
    await expect(page.locator('text=25% Match')).toBeVisible();
    await expect(page.locator('text=Authentic Cacio e Pepe')).toBeVisible();
  });

  test('should open recipe details and toggle checklist', async ({ page }) => {
    // Click on Cacio e Pepe card
    const cacioCard = page.locator('text=Authentic Cacio e Pepe');
    await cacioCard.click();

    // Verify recipe detail page loaded
    await expect(page.locator('h1:has-text("Authentic Cacio e Pepe")')).toBeVisible();
    await expect(page.locator('h2:has-text("Ingredients Checklist")')).toBeVisible();

    // Get the first ingredient checkbox
    const firstCheckbox = page.locator('input[type="checkbox"]').first();
    await expect(firstCheckbox).not.toBeChecked();

    // Click checkbox
    await firstCheckbox.check();
    await expect(firstCheckbox).toBeChecked();
  });

  test('should open add recipe form', async ({ page }) => {
    // Click "+ Add Recipe" tab button
    const addTabButton = page.locator('button:has-text("+ Add Recipe")');
    await addTabButton.click();

    // Verify Add Recipe form is visible
    await expect(page.locator('h1:has-text("Add New Recipe")')).toBeVisible();
    await expect(page.locator('input#recipe-title')).toBeVisible();
  });

});
