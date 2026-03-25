import uuid

from django.core.validators import MinValueValidator
from django.db import models
from django.urls import reverse
from django.utils.translation import gettext_lazy as _


class StudySession(models.Model):
    """Study session model"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    title = models.CharField(_("title"), max_length=200)
    description = models.TextField(_("description"), blank=True, default="")
    course = models.ForeignKey("Course", on_delete=models.CASCADE, related_name="study_sessions",
                               verbose_name=_("course"))  # TODO Implement this class
    creator = models.ForeignKey("User", on_delete=models.CASCADE, related_name="created_sessions",
                                verbose_name=_("creator"))  # TODO Implement this class
    date = models.DateField(_("date"))
    start_time = models.TimeField(_("starting time"))
    end_time = models.TimeField(_("ending time"))
    location = models.CharField(_("location"), max_length=200)
    max_participants = models.PositiveIntegerField(_("max participants"), default=10, validators=[MinValueValidator(1)])
    is_active = models.BooleanField(_("is active"), default=True)
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)

    class Meta:
        ordering = ["date", "start_time"]
        verbose_name = _("study session")
        verbose_name_plural = _("study sessions")
        indexes = [
            models.Index(fields=["data", "start_time"], name="idx_sessions_schedule"),
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
