# ThreadHub - Community Feed with Dynamic Leaderboard

A full-stack Django + React application featuring threaded discussions and a real-time karma-based leaderboard.

## Overview
Full-stack application implementing a threaded community feed with karma-based leaderboard (last 24 hours) using Django/DRF + React/Vite/Tailwind.

### Key Features
- **Threaded Comments**: Nested reply system like Reddit
- **Karma System**: +5 karma for comments on your posts, +5 for post likes, +1 for comment likes
- **Dynamic Leaderboard**: Top 5 users based on 24-hour karma
- **Full Error Handling**: Comprehensive error management throughout
- **CORS Support**: Proper cross-origin configuration (security hardened)
- **Mobile Responsive**: Works on all devices

### 🐛 Bug Fixes Implemented
- ✅ Comment karma feature (+5 to post authors when receiving comments)
- ✅ CORS preflight headers fixed (removed blocking cache headers)
- ✅ CORS_ALLOW_ALL_ORIGINS security hardened (specific origins only)
- ✅ Missing root_view function definition added
- ✅ Error handling improvements (try-catch throughout app)

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, click New Project → Import your repository.
3. Set the Root Directory to the repository root.
4. (Optional) Create a Vercel Postgres database and copy the connection string.
5. Add environment variables:
	- `SECRET_KEY`
	- `DEBUG=False`
	- `ALLOWED_HOSTS=.vercel.app`
	- `CORS_ALLOWED_ORIGINS=https://<your-app>.vercel.app`
	- `DATABASE_URL` (Vercel Postgres connection string)
6. Deploy.

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

Set the environment variable:
```bash
VITE_API_BASE=http://localhost:8000/api
```

## Using the App
- Create users via the top-right form.
- Select a user to post, comment, or like.
- Likes grant karma to the post/comment author.
- Comments on your posts grant you +5 karma.
- Leaderboard shows last 24 hours only.

## Notes
- SQLite is used by default. Swap to PostgreSQL in `backend/community_feed/settings.py` if desired.
- Comment tree is built server-side from a single query for the post.
- For production, set `DEBUG=False` and a strong `SECRET_KEY` in environment variables.
