from datetime import timedelta

from django.contrib.auth import get_user_model
from django.db import IntegrityError, transaction
from django.db.models import Count, F, Sum
from django.shortcuts import get_object_or_404
from django.utils import timezone
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Comment, CommentLike, KarmaEvent, Post, PostLike
from .serializers import (
    CommentCreateSerializer,
    PostListSerializer,
    UserCreateSerializer,
    UserLiteSerializer,
)

User = get_user_model()


def build_comment_tree(comments):
    nodes = {}
    children_map = {}

    for comment in comments:
        nodes[comment.id] = {
            "id": comment.id,
            "post": comment.post_id,
            "parent": comment.parent_id,
            "content": comment.content,
            "like_count": comment.like_count,
            "created_at": comment.created_at,
            "author": {
                "id": comment.author_id,
                "username": comment.author.username,
            },
            "children": [],
        }
        parent_id = comment.parent_id
        children_map.setdefault(parent_id, []).append(comment.id)

    for parent_id, child_ids in children_map.items():
        if parent_id is None:
            continue
        parent_node = nodes.get(parent_id)
        if parent_node is not None:
            parent_node["children"].extend(nodes[child_id] for child_id in child_ids)

    roots = [nodes[comment_id] for comment_id in children_map.get(None, [])]
    return roots


class PostListCreateView(generics.ListCreateAPIView):
    serializer_class = PostListSerializer

    def get_queryset(self):
        return (
            Post.objects.select_related("author")
            .annotate(comment_count=Count("comments"))
            .order_by("-created_at")
        )


class PostDetailView(APIView):
    def get(self, request, post_id):
        post = get_object_or_404(
            Post.objects.select_related("author").annotate(
                comment_count=Count("comments")
            ),
            pk=post_id,
        )
        comments = (
            Comment.objects.filter(post=post)
            .select_related("author")
            .order_by("created_at")
        )
        post_data = PostListSerializer(post).data
        post_data["comments"] = build_comment_tree(comments)
        return Response(post_data)


class CommentCreateView(generics.CreateAPIView):
    serializer_class = CommentCreateSerializer

    def perform_create(self, serializer):
        serializer.save()


class PostLikeView(APIView):
    def post(self, request, post_id):
        user_id = request.data.get("user_id")
        if not user_id:
            return Response({"detail": "user_id is required"}, status=400)
        user = get_object_or_404(User, pk=user_id)
        post = get_object_or_404(Post, pk=post_id)

        with transaction.atomic():
            try:
                like, created = PostLike.objects.get_or_create(user=user, post=post)
            except IntegrityError:
                return Response({"liked": False}, status=status.HTTP_200_OK)

            if created:
                Post.objects.filter(pk=post.pk).update(like_count=F("like_count") + 1)
                KarmaEvent.objects.create(
                    recipient=post.author,
                    actor=user,
                    post=post,
                    value=5,
                )
                return Response({"liked": True}, status=status.HTTP_201_CREATED)

        return Response({"liked": False}, status=status.HTTP_200_OK)


class CommentLikeView(APIView):
    def post(self, request, comment_id):
        user_id = request.data.get("user_id")
        if not user_id:
            return Response({"detail": "user_id is required"}, status=400)
        user = get_object_or_404(User, pk=user_id)
        comment = get_object_or_404(Comment, pk=comment_id)

        with transaction.atomic():
            try:
                like, created = CommentLike.objects.get_or_create(
                    user=user, comment=comment
                )
            except IntegrityError:
                return Response({"liked": False}, status=status.HTTP_200_OK)

            if created:
                Comment.objects.filter(pk=comment.pk).update(
                    like_count=F("like_count") + 1
                )
                KarmaEvent.objects.create(
                    recipient=comment.author,
                    actor=user,
                    comment=comment,
                    value=1,
                )
                return Response({"liked": True}, status=status.HTTP_201_CREATED)

        return Response({"liked": False}, status=status.HTTP_200_OK)


class LeaderboardView(APIView):
    def get(self, request):
        since = timezone.now() - timedelta(hours=24)
        rows = (
            KarmaEvent.objects.filter(created_at__gte=since)
            .values("recipient_id", "recipient__username")
            .annotate(karma=Sum("value"))
            .order_by("-karma", "recipient__username")[:5]
        )
        data = [
            {
                "user": {
                    "id": row["recipient_id"],
                    "username": row["recipient__username"],
                },
                "karma": row["karma"] or 0,
            }
            for row in rows
        ]
        return Response(data)


class UsersView(APIView):
    def get(self, request):
        users = User.objects.order_by("username")
        return Response(UserLiteSerializer(users, many=True).data)

    def post(self, request):
        serializer = UserCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserLiteSerializer(user).data, status=status.HTTP_201_CREATED)
