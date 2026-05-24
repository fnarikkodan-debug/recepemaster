import { MongoClient } from 'mongodb';

let client;
let clientPromise;

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable inside your environment settings.');
  }

  if (!clientPromise) {
    const options = {
      connectTimeoutMS: 10000, // Timeout after 10 seconds
    };

    if (process.env.NODE_ENV === 'development') {
      // In development mode, use a global variable to preserve the connection
      // across hot reloads.
      if (!global._mongoClientPromise) {
        client = new MongoClient(uri, options);
        global._mongoClientPromise = client.connect();
      }
      clientPromise = global._mongoClientPromise;
    } else {
      // In production mode, do not use global.
      client = new MongoClient(uri, options);
      clientPromise = client.connect();
    }
  }

  const connection = await clientPromise;
  const dbName = uri.split('/').pop()?.split('?')[0] || 'recipemaster';
  const db = connection.db(dbName);
  return { client: connection, db };
}
