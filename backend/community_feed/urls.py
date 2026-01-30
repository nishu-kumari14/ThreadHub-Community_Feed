from django.contrib import admin
from django.urls import include, path
from django.http import JsonResponse

        "message": "Welcome to ThreadHub API",
        "version": "1.0.0",
        "endpoints": {
            "api": "/api/",
            "admin": "/admin/",
            "posts": "/api/posts/",
            "users": "/api/users/",
            "leaderboard": "/api/leaderboard/"
        }
    })

urlpatterns = [
    path("", root_view, name="root"),
    path("admin/", admin.site.urls),
    path("api/", include("feed.urls")),
]
