#!/usr/bin/env python
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "community_feed.settings")
django.setup()

from feed.models import KarmaEvent
from django.utils import timezone
from datetime import timedelta
from django.db.models import Sum

since = timezone.now() - timedelta(hours=24)
events = KarmaEvent.objects.filter(created_at__gte=since).order_by('-created_at')

print("Recent Karma Events (last 24h):")
for event in events[:15]:
    target = f"Post {event.post_id}" if event.post else f"Comment {event.comment_id}"
    print(f"  {event.recipient.username} <- {event.actor.username} ({event.value} karma) on {target}")

print("\n24h Leaderboard:")
rows = (
    KarmaEvent.objects.filter(created_at__gte=since)
    .values("recipient__username")
    .annotate(total=Sum("value"))
    .order_by("-total")[:5]
)
for row in rows:
    print(f"  {row['recipient__username']}: {row['total']} karma")
