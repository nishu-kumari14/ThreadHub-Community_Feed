# Community Feed Prototype

## Overview
Prototype implementing a threaded community feed with karma-based leaderboard (last 24 hours) using Django/DRF + React/Tailwind.

## Backend (Django)

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py makemigrations
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

The API runs at `http://localhost:8000/api`.

## Frontend (React + Vite + Tailwind)

```bash
cd frontend
npm install
npm run dev
```

By default, the frontend calls `http://localhost:8000/api`. You can override with:

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
