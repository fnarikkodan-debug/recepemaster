import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import handler from './api/recipes.js';

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'local-api-middleware',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          // Intercept requests targeting our recipes database API
          if (req.url.startsWith('/api/recipes')) {
            // Mock Vercel res helper functions on Node standard response object
            res.json = (data) => {
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(data));
            };
            res.status = (code) => {
              res.statusCode = code;
              return res;
            };

            // Read request body stream for POST/PUT methods
            if (req.method === 'POST' || req.method === 'PUT') {
              let body = '';
              for await (const chunk of req) {
                body += chunk;
              }
              req.body = body;
            }

            // Ensure MONGODB_URI is loaded into process.env from .env.local
            if (!process.env.MONGODB_URI) {
              try {
                const envPath = path.resolve('.env.local');
                if (fs.existsSync(envPath)) {
                  const content = fs.readFileSync(envPath, 'utf8');
                  const lines = content.split('\n');
                  for (const line of lines) {
                    const trimmed = line.trim();
                    if (trimmed.startsWith('MONGODB_URI=')) {
                      process.env.MONGODB_URI = trimmed.split('MONGODB_URI=')[1].trim();
                    }
                  }
                }
              } catch (e) {
                console.error("Vite local API middleware failed to read .env.local", e);
              }
            }

            try {
              // Execute the serverless handler code
              await handler(req, res);
            } catch (err) {
              console.error("Vite local API middleware runtime error:", err);
              res.statusCode = 500;
              res.end(JSON.stringify({ error: 'Local Middleware Error', message: err.message }));
            }
          } else {
            next();
          }
        });
      }
    }
  ]
});
