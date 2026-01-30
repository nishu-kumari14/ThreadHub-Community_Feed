# ThreadHub - Community Feed with Dynamic Leaderboard

A full-stack Django + React application featuring threaded discussions and a real-time karma-based leaderboard.

## 🚀 Quick Deploy to Railway

Click to deploy your own instance:

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new)

**Or follow the [Railway Deployment Guide](./RAILWAY_DEPLOYMENT.md)**

## Overview
Full-stack application implementing a threaded community feed with karma-based leaderboard (last 24 hours) using Django/DRF + React/Vite/Tailwind.

### Key Features
- **Threaded Comments**: Nested reply system like Reddit
- **Karma System**: +5 karma for post likes, +1 for comment likes
- **Dynamic Leaderboard**: Top 5 users based on 24-hour karma
- **Full Error Handling**: Comprehensive error management throughout
- **CORS Support**: Proper cross-origin configuration
- **Mobile Responsive**: Works on all devices

### 🐛 Bug Fixes
- ✅ Comment karma feature (post authors get +5 when receiving comments)
- ✅ CORS preflight headers fixed (removed blocking cache headers)
- ✅ Error handling improvements (try-catch throughout app)

## Backend (Django)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API runs at `http://localhost:8000/api`.

## Frontend (React + Vite + Tailwind)

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`, calls `http://localhost:8000/api`.
```bash
VITE_API_BASE=http://localhost:8000/api
```

## Using the App
- Create users via the top-right form.
- Select a user to post, comment, or like.
- Likes grant karma to the post/comment author.
- Leaderboard shows last 24 hours only.

## Notes
- SQLite is used by default. Swap to PostgreSQL in `backend/community_feed/settings.py` if desired.
- Comment tree is built server-side from a single query for the post.
