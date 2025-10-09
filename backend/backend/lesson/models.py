from django.db import models
from django.utils.translation import gettext_lazy as _

# Create your models here.
from common.model import BaseModel


def lesson_image_upload_to(instance, filename):
    return 'images/lesson/{}/{}'.format(instance.name, filename)


class Lesson(BaseModel):
    name = models.CharField(_('课程名称'), max_length=255)
    image = models.ImageField(_('课程封面图'), upload_to=lesson_image_upload_to)

    class Meta:
        verbose_name = _("课程")
        verbose_name_plural = verbose_name


class Chapter(BaseModel):

    name = models.CharField(_('章节名称'), max_length=255)
    content = models.TextField(_('章节内容'), default='')

    lesson_id = models.IntegerField(_('课程ID'))

    class Meta:
        verbose_name = _("章节")
        verbose_name_plural = verbose_name
