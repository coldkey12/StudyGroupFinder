import uuid

from django.db import models
from django.utils.translation import gettext_lazy as _


class CourseManager(models.Manager):
    def with_session_count(self):
        return self.annotate(session_count=models.Count("study_sessions"))


class Course(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(_("name"), max_length=200, unique=True)
    code = models.CharField(_("code"), max_length=20, unique=True)
    description = models.TextField(_("description"), blank=True, default="")
    created_at = models.DateTimeField(_("created at"), auto_now_add=True)

    objects = CourseManager()

    class Meta:
        ordering = ["name"]
        verbose_name = _("course")
        verbose_name_plural = _("courses")

    def __str__(self):
        return f"{self.code} - {self.name}"
