from rest_framework import serializers

from .models import Course


class CourseSerializer(serializers.ModelSerializer):
    session_count = serializers.IntegerField(read_only=True, required=False)

    class Meta:
        model = Course
        fields = ["id", "name", "code", "description", "session_count", "created_at"]
        read_only_fields = ["id", "created_at"]
