from django.urls import path

from . import views

app_name = "sessions"

urlpatterns = [
    path("", views.SessionListView.as_view(), name="list"),
    path("<uuid:pk>/", views.SessionDetailView.as_view(), name="detail"),
    path("<uuid:pk>/join/", views.join_session, name="join"),
    path("<uuid:pk>/leave/", views.leave_session, name="leave"),
    path("<uuid:pk>/participants/", views.session_participants, name="participants"),
    path("<uuid:session_pk>/comments/", views.CommentListView.as_view(), name="comments"),
]
