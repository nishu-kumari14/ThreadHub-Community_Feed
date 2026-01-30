from django.contrib import admin

from .models import Comment, CommentLike, KarmaEvent, Post, PostLike


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ("id", "author", "like_count", "created_at")


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = ("id", "post", "author", "parent", "like_count", "created_at")


admin.site.register(PostLike)
admin.site.register(CommentLike)
admin.site.register(KarmaEvent)
