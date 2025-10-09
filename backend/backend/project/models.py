import os

from django.db import models
from django.utils.translation import gettext_lazy as _
# Create your models here.
from common.model import BaseModel
from config.settings.base import BASE_DIR, APPS_DIR


class Team(BaseModel):

    name = models.CharField(_('团队名称'), max_length=255)

    class Meta:
        verbose_name = _("团队")
        verbose_name_plural = verbose_name


class TeamUser(BaseModel):

    team_id = models.IntegerField(_('团队 ID'))
    username = models.CharField(_('用户名'), max_length=255)
    level = models.CharField(_('用户等级'), default='normal', max_length=255)

    class Meta:
        verbose_name = _("团队用户关系")
        verbose_name_plural = verbose_name


class Project(BaseModel):

    name = models.CharField(_('项目名称'), max_length=255)
    team_id = models.IntegerField(_('团队 ID'))

    class Meta:
        verbose_name = _("项目")
        verbose_name_plural = verbose_name


class ProjectUser(BaseModel):

    project_id = models.IntegerField(_('项目 ID'))
    username = models.CharField(_('用户名'), max_length=255)
    level = models.CharField(_('用户等级'), default='normal', max_length=255)

    class Meta:
        verbose_name = _("项目用户关系")
        verbose_name_plural = verbose_name


def file_upload_to(instance, filename):
    return os.path.join('data', instance.app, instance.path, filename)


class LocalFile(BaseModel):
    path = models.CharField(_('文件夹路径'), max_length=255)
    file = models.FileField(_('文件'), upload_to=file_upload_to)
    app = models.CharField(_('隶属APP'), max_length=255)

    class Meta:
        verbose_name = _("本地文件")
        verbose_name_plural = verbose_name
