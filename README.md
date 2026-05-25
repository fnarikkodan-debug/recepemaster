# RecipeMaster.com 🍳

Welcome to **RecipeMaster.com**, a modern, responsive web application for exploring gourmet recipes, matching available ingredients using a smart Fridge Matcher (including a simulated AI image scanner), and writing new recipe plans.

The UI is built with a premium theme inspired by the **Pantone Color of the Year 2025: Mocha Mousse (#A47864)**. It incorporates modern design guidelines such as translucent glassmorphism cards, warm cozy gradients, custom dark/light theme switching, responsive grid layouts, and custom vector icons.

---

## 🚀 Features

- **Explore Recipes**: High-fidelity dashboard displaying recipe cards. Filter dishes by Country, State, Spice level, Cook time, and Rating.
- **Recipe details**: View checkable ingredient lists, YouTube video walkthroughs, and submit/average star ratings with user reviews.
- **Fridge Matcher**: Enter ingredients manually or upload `.txt` comma-separated grocery lists.
- **AI Fridge Scanner**: Drag-and-drop or select an image of your refrigerator to simulate a computer-vision scan that extracts ingredients automatically.
- **Add Recipe Panel**: Create and post recipes with dynamic ingredient and step counters.
- **Google Analytics Integration**: Track user funnel engagement (selection, review ratings, ingredient matcher scans, and recipe creation steps) under tracking ID `G-N35F91XVML`.
- **Global DB Persistence**: Fully integrated with a serverless Node.js backend linked to MongoDB.

---

## 🛠️ Local Application Setup

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v18 or higher) installed.

### 1. Install Dependencies
Navigate to the root directory `/Users/gopinathnarikkodan/Projects/Gravitize` and install all necessary packages:
```bash
npm install
```

### 2. Configure Environment Variables
Copy the example environment file:
```bash
cp .env.example .env.local
```
Open `.env.local` and paste your actual MongoDB Atlas connection string URI:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/dbname?retryWrites=true&w=majority
```

---

## 💻 Running the App Locally

Start the local Vite development server:
```bash
npm run dev
```
- The application will be accessible at: **`http://localhost:5173`**
- **Local API Middleware**: The Vite server automatically intercepts calls targeting `/api/recipes` and runs the database handlers locally via Vite middleware (mimicking serverless functions).

### Production Build
To verify compiler correctness or create a production-ready static bundle:
```bash
npm run build
```

---

## 🧪 Testing Instructions (Playwright E2E)

We use **Playwright** for automated end-to-end browser tests verifying layout rendering, search queries, Fridge Matcher evaluations, details view checklists, and creation forms.

### 1. Install Browser Binaries (First time setup)
If you haven't already, download the required browser binaries for Playwright:
```bash
npx playwright install
```

### 2. Run All Tests
To run the automated suite headless across Chromium, Firefox, and WebKit (Safari):
```bash
npm run test
```
*Note: This automatically starts the local web server, verifies all routes/interactions, and shuts down safely.*

### 3. Run in UI / Interactive Mode
To run tests inside Playwright's visual interface where you can step through line-by-line:
```bash
npx playwright test --ui
```

### 4. Run for Specific Browsers / Projects
To execute tests only on Google Chrome:
```bash
npx playwright test --project=chromium
```

### 5. View Test Reports
To open a detailed HTML report of the test results:
```bash
npx playwright show-report
```
