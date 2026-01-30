from django.contrib.auth import get_user_model
from rest_framework import serializers

from .models import Comment, Post

User = get_user_model()


class UserLiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username")


class UserCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "username")
        read_only_fields = ("id",)


class PostListSerializer(serializers.ModelSerializer):
    author = UserLiteSerializer(read_only=True)
    author_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source="author", write_only=True
    )
    comment_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Post
        fields = (
            "id",
            "content",
            "like_count",
            "created_at",
            "comment_count",
            "author",
            "author_id",
        )


class CommentCreateSerializer(serializers.ModelSerializer):
    author_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), source="author", write_only=True
    )

    class Meta:
        model = Comment
        fields = ("id", "post", "parent", "content", "created_at", "author_id")
        read_only_fields = ("id", "created_at")

    def validate(self, attrs):
        parent = attrs.get("parent")
        post = attrs.get("post")
        if parent and post and parent.post_id != post.id:
            raise serializers.ValidationError(
                {"parent": "Parent comment must belong to the same post."}
            )
        return attrs
