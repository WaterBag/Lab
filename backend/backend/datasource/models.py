import os

from django.db import models
from django.utils.translation import gettext_lazy as _

# Create your models here.
from common.model import BaseModel


class DatasourceManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


def datasource_image_upload_to(instance, filename):
    file_name, file_extension = os.path.splitext(filename)
    return f'images/datasource/{instance.path}{file_extension}'


class Datasource(BaseModel):
    name = models.CharField(_('数据集名称'), max_length=255)
    image = models.ImageField(_('封面图'), max_length=255, null=True, blank=True, upload_to=datasource_image_upload_to)
    path = models.CharField(_('路径'), max_length=255, null=True, blank=True)
    team_id = models.IntegerField(_('团队 ID'), null=True, blank=True)
    belong = models.CharField(_('归属性质'), default='private', max_length=255)
    files = models.JSONField(_('文件列表'), default=list)
    read_me = models.TextField(_('详细描述'), default='')

    objects = DatasourceManager()

    class Meta:
        verbose_name = _("数据集")
        verbose_name_plural = verbose_name

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        if self.is_deleted:
            DatasourceFavorites.objects.filter(datasource_id=self.pk).delete()
        return super().save(force_insert, force_update, using, update_fields)


class DatasourceFavorites(models.Model):
    datasource_id = models.IntegerField(_('数据集ID'))
    username = models.CharField(_('用户名'), max_length=255)

    class Meta:
        verbose_name = _("数据集收藏")
        verbose_name_plural = verbose_name
