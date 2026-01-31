# Playto Engineering Challenge

## The Objective

Build a "Community Feed" prototype with threaded discussions and a dynamic leaderboard.

At **Playto**, we value speed and craftsmanship. We want to see if you can build complex systems efficiently while maintaining high standards for performance and data integrity.

**The Stack:**

- **Backend:** Django & Django REST Framework (DRF).
- **Frontend:** React (Tailwind CSS preferred).
- **Database:** SQLite or PostgreSQL.

## The Requirements

### 1. Core Features

- **The Feed:** Display text posts with their Author and "Like" count.
- **Threaded Comments:** Users can comment on posts, *and* reply to other comments (nested threads, like Reddit).
- **Gamification:**
    - 1 Like on a Post = 5 Karma.
    - 1 Like on a Comment = 1 Karma.
- **The Leaderboard:** A widget showing the "Top 5 Users" based on Karma earned **in the last 24 hours only**.

### 2. Technical Constraints

*Please pay attention to these details—they are the most important part of the assignment.*

- **The N+1 Nightmare (Comments):**
    - Loading a post with 50 nested comments should not trigger 50 SQL queries.
    - **Constraint:** Fetch the post and its comment tree efficiently.
- **Concurrency:**
    - Ensure users cannot "double like" a post or comment to inflate Karma.
    - Handle race conditions on the "Like" button logic.
- **Complex Aggregation (Leaderboard):**
    - The leaderboard must *only* count Karma earned in the last 24 hours.
    - **Constraint:** Do not store "Daily Karma" in a simple integer field on the User model. Calculate it dynamically from the transaction/activity history.

### 3. AI & Tools Policy

**We strongly encourage the use of AI tools (ChatGPT, Cursor, Copilot, etc.) to move fast.**

However, we are looking for engineers who are "AI-Native," not "AI-Dependent."

- **The Expectation:** You should be able to explain, debug, and optimize every line of code you submit.
- **The Reality:** AI often messes up complex aggregation and recursive queries. It is your job to catch these mistakes, not ship them.

---

## Deliverables

Please provide a link to a GitHub repository containing:

1. **The Code:** With a `README.md` that explains how to run the app locally.
2. Your project hosted somewhere on the cloud (can use free tier of Railway/Vercel etc.)
3. **`EXPLAINER.md`:** A short document answering the following:
    - **The Tree:** How did you model the nested comments in the database? How did you serialize them without killing the DB?
    - **The Math:** Paste the QuerySet or SQL used to calculate the "Last 24h Leaderboard."
    - **The AI Audit:** Give us one specific example where the AI wrote code that was buggy or inefficient, and explain how you fixed it.

**Bonus (Optional):**

- **Docker:** A `docker-compose` setup.
- **Testing:** One meaningful test case (e.g., testing the leaderboard calculation logic).