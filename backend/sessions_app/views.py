from django.db.models import Count
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Comment, RSVP, StudySession
from .serializers import CommentSerializer, RSVPSerializer, StudySessionSerializer


# --------------- Class-Based Views ---------------

class SessionListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        qs = StudySession.objects.annotate(participants_count=Count("rsvps")).select_related("course", "creator")

        course = request.query_params.get("course")
        if course:
            qs = qs.filter(course_id=course)

        date = request.query_params.get("date")
        if date:
            qs = qs.filter(date=date)

        search = request.query_params.get("search")
        if search:
            qs = qs.filter(title__icontains=search)

        serializer = StudySessionSerializer(qs, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = StudySessionSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class SessionDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def _get_session(self, pk):
        return StudySession.objects.annotate(participants_count=Count("rsvps")).select_related("course", "creator").get(pk=pk)

    def get(self, request, pk):
        try:
            session = self._get_session(pk)
        except StudySession.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(StudySessionSerializer(session).data)

    def put(self, request, pk):
        try:
            session = self._get_session(pk)
        except StudySession.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if session.creator != request.user:
            return Response({"detail": "Not the session owner."}, status=status.HTTP_403_FORBIDDEN)
        serializer = StudySessionSerializer(session, data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def delete(self, request, pk):
        try:
            session = self._get_session(pk)
        except StudySession.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        if session.creator != request.user:
            return Response({"detail": "Not the session owner."}, status=status.HTTP_403_FORBIDDEN)
        session.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)


class CommentListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, session_pk):
        comments = Comment.objects.filter(session_id=session_pk).select_related("author")
        return Response(CommentSerializer(comments, many=True).data)

    def post(self, request, session_pk):
        try:
            session = StudySession.objects.get(pk=session_pk)
        except StudySession.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = CommentSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(session=session, author=request.user)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# --------------- Function-Based Views ---------------

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def join_session(request, pk):
    try:
        session = StudySession.objects.get(pk=pk)
    except StudySession.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)

    if RSVP.objects.filter(session=session, user=request.user).exists():
        return Response({"detail": "Already joined."}, status=status.HTTP_400_BAD_REQUEST)

    if session.rsvps.count() >= session.max_participants:
        return Response({"detail": "Session is full."}, status=status.HTTP_400_BAD_REQUEST)

    rsvp = RSVP.objects.create(session=session, user=request.user)
    return Response(RSVPSerializer(rsvp).data, status=status.HTTP_201_CREATED)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def leave_session(request, pk):
    deleted, _ = RSVP.objects.filter(session_id=pk, user=request.user).delete()
    if not deleted:
        return Response({"detail": "Not joined."}, status=status.HTTP_400_BAD_REQUEST)
    return Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def session_participants(request, pk):
    rsvps = RSVP.objects.filter(session_id=pk).select_related("user")
    return Response(RSVPSerializer(rsvps, many=True).data)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def my_sessions(request):
    session_ids = RSVP.objects.filter(user=request.user).values_list("session_id", flat=True)
    sessions = StudySession.objects.filter(pk__in=session_ids).annotate(
        participants_count=Count("rsvps")
    ).select_related("course", "creator")
    return Response(StudySessionSerializer(sessions, many=True).data)


@api_view(["DELETE"])
@permission_classes([IsAuthenticated])
def delete_comment(request, pk):
    try:
        comment = Comment.objects.get(pk=pk)
    except Comment.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    if comment.author != request.user:
        return Response({"detail": "Not the comment author."}, status=status.HTTP_403_FORBIDDEN)
    comment.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
