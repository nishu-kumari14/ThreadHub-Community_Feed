from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db.models import Sum
from django.test import TestCase
from django.utils import timezone

from .models import KarmaEvent

User = get_user_model()


class LeaderboardTest(TestCase):
    def test_leaderboard_last_24h(self):
        alice = User.objects.create_user(username="alice")
        bob = User.objects.create_user(username="bob")

        KarmaEvent.objects.create(recipient=alice, actor=bob, value=5)
        KarmaEvent.objects.create(recipient=alice, actor=bob, value=1)
        KarmaEvent.objects.create(recipient=bob, actor=alice, value=1)
        old_event = KarmaEvent.objects.create(recipient=bob, actor=alice, value=10)
        old_event.created_at = timezone.now() - timedelta(days=2)
        old_event.save(update_fields=["created_at"])

        since = timezone.now() - timedelta(hours=24)
        rows = (
            KarmaEvent.objects.filter(created_at__gte=since)
            .values("recipient_id")
            .annotate(total=Sum("value"))
        )
        totals = {row["recipient_id"]: row["total"] for row in rows}
        self.assertEqual(totals[alice.id], 6)
        self.assertEqual(totals[bob.id], 1)
