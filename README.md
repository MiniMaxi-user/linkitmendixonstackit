# LINKIT — Mendix on STACKIT Workshop

Intake workshop questionnaire tool for migrating Mendix applications to STACKIT.

## Local development

```bash
npm install
npm start
```

## Deploy to Vercel

### Option A — Vercel CLI (fastest)
```bash
npm install -g vercel
vercel
```

### Option B — GitHub + Vercel dashboard
1. Push this folder to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import the repository
4. Framework preset: **Create React App**
5. Click **Deploy**

No environment variables needed. All data is stored in the browser (localStorage).

## Project structure

```
src/
  App.js        ← entire application (single file)
  index.js      ← React entry point
public/
  index.html    ← HTML shell
vercel.json     ← SPA routing for Vercel
package.json
```
