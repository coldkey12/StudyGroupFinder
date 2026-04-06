from django.contrib import admin
from django.urls import include, path

from sessions_app.views import delete_comment, my_sessions

urlpatterns = [
    path("admin/", admin.site.urls),
    # Auth endpoints
    path("api/auth/", include("accounts.urls")),
    # App endpoints
    path("api/courses/", include("courses.urls")),
    path("api/sessions/", include("sessions_app.urls")),
    path("api/my-sessions/", my_sessions, name="my-sessions"),
    path("api/comments/<uuid:pk>/", delete_comment, name="delete-comment"),
]
