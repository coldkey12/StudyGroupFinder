import uuid

from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _


class StudySession(models.Model):
    """Study session model."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(_("title"), max_length=200)
    description = models.TextField(_("description"), blank=True, default="")
    course = models.ForeignKey(
        "courses.Course",
        on_delete=models.CASCADE,
        related_name="study_sessions",
        verbose_name=_("course"),
    )
    creator = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="created_sessions",
        verbose_name=_("creator"),
    )
    date = models.DateField(_("date"))
    start_time = models.TimeField(_("starting time"))
    end_time = models.TimeField(_("ending time"))
    location = models.CharField(_("location"), max_length=200)
    max_participants = models.PositiveIntegerField(
        _("max participants"), default=10, validators=[MinValueValidator(1)]
    )
    is_active = models.BooleanField(_("is active"), default=True)
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)

    class Meta:
        ordering = ["date", "start_time"]
        verbose_name = _("study session")
        verbose_name_plural = _("study sessions")
        indexes = [
            models.Index(fields=["date", "start_time"], name="idx_sessions_schedule"),
            models.Index(fields=["creator", "is_active"], name="idx_sessions_creator"),
        ]
        constraints = [
            models.CheckConstraint(
                check=models.Q(end_time__gt=models.F("start_time")),
                name="end_after_start",
            ),
        ]

    def __str__(self):
        return f"{self.title} - {self.date}"

    def get_absolute_url(self):
        return reverse("sessions:detail", kwargs={"pk": self.pk})


class RSVP(models.Model):
    """RSVP / join session model."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(
        StudySession,
        on_delete=models.CASCADE,
        related_name="rsvps",
        verbose_name=_("session"),
    )
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="rsvps",
        verbose_name=_("user"),
    )
    created_at = models.DateTimeField(_("joined at"), auto_now_add=True)

    class Meta:
        unique_together = ("session", "user")
        verbose_name = _("RSVP")
        verbose_name_plural = _("RSVPs")

    def __str__(self):
        return f"{self.user} → {self.session}"


class Comment(models.Model):
    """Comment on a study session."""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    session = models.ForeignKey(
        StudySession,
        on_delete=models.CASCADE,
        related_name="comments",
        verbose_name=_("session"),
    )
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="comments",
        verbose_name=_("author"),
    )
    text = models.TextField(_("text"))
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)

    class Meta:
        ordering = ["created_at"]
        verbose_name = _("comment")
        verbose_name_plural = _("comments")

    def __str__(self):
        return f"Comment by {self.author} on {self.session}"
