from django.db import models
from django.utils.translation import gettext_lazy as _


class ExcludeDeletedManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset().filter(is_deleted=False)


class BaseModel(models.Model):
    created_by = models.CharField(_("创建人"), max_length=255, null=True, blank=True)
    created_at = models.DateTimeField(
        _("创建时间"), auto_now_add=True, null=True, blank=True
    )
    updated_by = models.CharField(_("更新人"), max_length=255, null=True, blank=True)
    updated_at = models.DateTimeField(_("更新时间"), null=True, blank=True)
    is_deleted = models.BooleanField(_("是否删除"), default=False)
    deleted_by = models.CharField(_("删除人"), max_length=255, null=True, blank=True)
    deleted_at = models.DateTimeField(_("删除时间"), null=True, blank=True)
    description = models.TextField(_("描述"), null=True, blank=True)

    objects = ExcludeDeletedManager()

    class Meta:
        abstract = True
