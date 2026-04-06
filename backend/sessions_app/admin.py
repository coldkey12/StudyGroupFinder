from django.contrib import admin

from .models import Comment, RSVP, StudySession

admin.site.register(StudySession)
admin.site.register(RSVP)
admin.site.register(Comment)
