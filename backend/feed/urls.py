from django.urls import path

from .views import (
    CommentCreateView,
    CommentLikeView,
    LeaderboardView,
    PostDetailView,
    PostLikeView,
    PostListCreateView,
    UsersView,
)

urlpatterns = [
    path("posts/", PostListCreateView.as_view(), name="post-list"),
    path("posts/<int:post_id>/", PostDetailView.as_view(), name="post-detail"),
    path("posts/<int:post_id>/like/", PostLikeView.as_view(), name="post-like"),
    path("comments/", CommentCreateView.as_view(), name="comment-create"),
    path(
        "comments/<int:comment_id>/like/",
        CommentLikeView.as_view(),
        name="comment-like",
    ),
    path("leaderboard/", LeaderboardView.as_view(), name="leaderboard"),
    path("users/", UsersView.as_view(), name="users"),
]
