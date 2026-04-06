from datetime import datetime

from django.utils import timezone
from rest_framework import serializers

from .models import Comment, RSVP, StudySession


class StudySessionSerializer(serializers.ModelSerializer):
    is_overdue = serializers.SerializerMethodField()
    duration_minutes = serializers.SerializerMethodField()
    spots_remaining = serializers.SerializerMethodField()
    creator_name = serializers.CharField(source="creator.get_full_name", read_only=True)
    course_name = serializers.CharField(source="course.name", read_only=True)

    class Meta:
        model = StudySession
        fields = [
            "id", "title", "description", "course", "creator",
            "course_name", "creator_name", "date", "start_time", "end_time",
            "location", "max_participants", "is_active",
            "is_overdue", "duration_minutes", "spots_remaining", "created_at",
        ]
        read_only_fields = ["id", "creator", "created_at"]
        extra_kwargs = {
            "title": {"min_length": 3},
            "max_participants": {"min_value": 1, "max_value": 100},
            "date": {"help_text": "Format: YYYY-MM-DD"},
            "start_time": {"help_text": "Format: HH:MM"},
            "end_time": {"help_text": "Format: HH:MM"},
        }

    def get_is_overdue(self, obj):
        return obj.is_active and obj.date < timezone.now().date()

    def get_duration_minutes(self, obj):
        start = datetime.combine(datetime.min, obj.start_time)
        end = datetime.combine(datetime.min, obj.end_time)
        return int((end - start).total_seconds() / 60)

    def get_spots_remaining(self, obj):
        current = getattr(obj, "participants_count", obj.rsvps.count())
        return max(0, obj.max_participants - current)

    def validate_date(self, value):
        if value < timezone.now().date():
            raise serializers.ValidationError("Session date cannot be in the past.")
        return value

    def validate_title(self, value):
        return " ".join(value.split())

    def validate(self, data):
        start = data.get("start_time") or getattr(self.instance, "start_time", None)
        end = data.get("end_time") or getattr(self.instance, "end_time", None)
        if start and end and end <= start:
            raise serializers.ValidationError({"end_time": "End time must be after start time."})
        return data

    def create(self, validated_data):
        validated_data["creator"] = self.context["request"].user
        return super().create(validated_data)

    def update(self, instance, validated_data):
        validated_data.pop("creator", None)
        return super().update(instance, validated_data)

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data["course"] = {"id": str(instance.course.id), "name": instance.course.name}
        return data


class RSVPSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = RSVP
        fields = ["id", "session", "user", "username", "created_at"]
        read_only_fields = ["id", "session", "user", "created_at"]


class CommentSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.username", read_only=True)

    class Meta:
        model = Comment
        fields = ["id", "session", "author", "author_name", "text", "created_at"]
        read_only_fields = ["id", "session", "author", "created_at"]
