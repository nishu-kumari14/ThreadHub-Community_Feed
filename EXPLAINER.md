# Explainer

## The Tree
**Modeling:**
- `Comment` has a self-referential `parent` foreign key.
- Each `Comment` belongs to a `Post` and has an `author`.

**Querying efficiently:**
- For a post detail, all comments are fetched in one query:
  ```python
  Comment.objects.filter(post=post)
      .select_related("author")
      .order_by("created_at")
  ```
- The tree is built in memory from the flat list, preventing N+1 queries.

## The Math (Last 24h Leaderboard)

**Karma Sources (as per spec):**
- 1 Like on a Post = 5 Karma to post author
- 1 Like on a Comment = 1 Karma to comment author

**Queryset used:**
```python
since = timezone.now() - timedelta(hours=24)
rows = (
    KarmaEvent.objects.filter(created_at__gte=since)
    .values("recipient_id", "recipient__username")
    .annotate(karma=Sum("value"))
    .order_by("-karma", "recipient__username")[:5]
)
```

This aggregates from `KarmaEvent` table so no derived "daily karma" field is stored on `User`. All karma events (likes on posts and comments) are tracked with timestamps, enabling accurate 24-hour windowed calculations.

## The AI Audit
**Issue:** The AI initially attempted to compute leaderboard totals from `Post.like_count` and `Comment.like_count` directly, which would incorrectly include likes outside the last 24 hours.

**Fix:** I introduced a `KarmaEvent` table that records each like with a timestamp. The leaderboard aggregates these events with a 24-hour filter, ensuring correct time-windowed karma without denormalizing on `User`.
