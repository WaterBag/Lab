from django.db import models
from django.utils.translation import gettext_lazy as _

# Create your models here.
from common.model import BaseModel


class ComponentCategory(BaseModel):
    name = models.CharField(_('分组名称'), max_length=50)
    genre = models.CharField(_('分组类型'), default='common', max_length=50)
    key = models.CharField(_('分类Key'), max_length=255)

    class Meta:
        verbose_name = _("组件分类")
        verbose_name_plural = verbose_name


class Component(BaseModel):
    name = models.CharField(_('组件名称'), max_length=50)
    source = models.TextField(_('源代码'))
    paramsConfig = models.JSONField(_('参数配置'), default=dict)
    inputConfig = models.JSONField(_('输入参数'), default=dict)
    outputConfig = models.JSONField(_('输出参数'), default=dict)
    team_id = models.IntegerField(_('所属团队'), null=True, blank=True)
    category = models.CharField(_('所属分组'), max_length=50)
    genre = models.CharField(_('组件类型'), default='common', max_length=50)
    project_id = models.IntegerField(_('项目ID'), null=True, blank=True)

    class Meta:
        verbose_name = _("分析组件")
        verbose_name_plural = verbose_name

    def save(self, force_insert=False, force_update=False, using=None, update_fields=None):
        if self.is_deleted:
            ComponentFavorites.objects.filter(component_id=self.pk).delete()
        return super().save(force_insert, force_update, using, update_fields)


class ComponentFavorites(models.Model):
    component_id = models.IntegerField(_('组件ID'))
    project_id = models.IntegerField(_('项目ID'))
    username = models.CharField(_('用户名'), max_length=255)

    class Meta:
        verbose_name = _("组件收藏")
        verbose_name_plural = verbose_name
