from django.conf import settings
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='profile'
    )
    bio = models.TextField(blank=True)
    university_group = models.CharField(max_length=20, blank=True)
    avatar_url = models.URLField(blank=True)

    def __str__(self):
        return f"{self.user.username} profile"