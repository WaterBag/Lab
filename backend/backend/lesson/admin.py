from django.contrib import admin

# Register your models here.
from backend.lesson.models import Lesson


class LessonAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'created_by', 'created_at', 'is_deleted')


admin.site.register(Lesson, LessonAdmin)
