from django.conf import settings
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="profile",
    )
    bio = models.TextField(blank=True, default="")
    university = models.CharField(max_length=255, blank=True, default="")
    major = models.CharField(max_length=255, blank=True, default="")

    def __str__(self):
        return f"{self.user.username}'s profile"
