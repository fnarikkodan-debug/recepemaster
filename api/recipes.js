import { connectToDatabase } from './db.js';
import { initialRecipes } from '../src/data/initialRecipes.js';

export default async function handler(req, res) {
  const { method } = req;

  // Safety parser in case body was not pre-parsed by the runner
  let body = req.body;
  if (body && typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch (e) {
      console.warn("Body was a string but failed to parse as JSON", e);
    }
  }

  try {
    const { db } = await connectToDatabase();

    if (method === 'GET') {
      const recipes = await db.collection('recipes').find({}).toArray();
      
      // Auto-seeding: If collection is empty, write initial recipes
      if (recipes.length === 0) {
        await db.collection('recipes').insertMany(initialRecipes);
        return res.status(200).json(initialRecipes);
      }
      
      return res.status(200).json(recipes);
    } 
    
    if (method === 'POST') {
      const newRecipe = body;
      if (!newRecipe || !newRecipe.title) {
        return res.status(400).json({ error: 'Recipe details are required' });
      }

      // Ensure id uniqueness
      const exists = await db.collection('recipes').findOne({ id: newRecipe.id });
      if (exists) {
        newRecipe.id = `${newRecipe.id}-${Date.now()}`;
      }

      await db.collection('recipes').insertOne(newRecipe);
      return res.status(201).json(newRecipe);
    } 
    
    if (method === 'PUT') {
      const { recipeId, review } = body || {};
      if (!recipeId || !review) {
        return res.status(400).json({ error: 'Recipe ID and review details are required' });
      }

      const recipe = await db.collection('recipes').findOne({ id: recipeId });
      if (!recipe) {
        return res.status(404).json({ error: 'Recipe not found' });
      }

      // Calculate new average stars rating
      const updatedReviews = recipe.reviews ? [...recipe.reviews, review] : [review];
      const sum = updatedReviews.reduce((acc, curr) => acc + curr.rating, 0);
      const avgStars = parseFloat((sum / updatedReviews.length).toFixed(1));

      await db.collection('recipes').updateOne(
        { id: recipeId },
        { 
          $set: { stars: avgStars },
          $push: { reviews: review }
        }
      );

      return res.status(200).json({ success: true, stars: avgStars });
    }

    res.setHeader('Allow', ['GET', 'POST', 'PUT']);
    return res.status(405).end(`Method ${method} Not Allowed`);
  } catch (error) {
    console.error("API error in serverless handler:", error);
    return res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
}
