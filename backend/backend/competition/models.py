from django.db import models
from django.utils.translation import gettext_lazy as _
# Create your models here.
from common.model import BaseModel


class Competition(BaseModel):

    name = models.CharField(_('比赛名称'), max_length=255)
    test_data = models.CharField(_('测试集'), max_length=255)
    valid_data = models.CharField(_('验证集'), max_length=255)
    valid_code = models.TextField(_('验证代码'), default='')
    end_at = models.DateTimeField(_('比赛结束时间'))

    class Meta:
        verbose_name = _("比赛")
        verbose_name_plural = verbose_name


class CompetitionUser(BaseModel):

    competition_id = models.IntegerField(_("比赛ID"))
    username = models.CharField(_('用户名'), max_length=255)

    class Meta:
        verbose_name = _("比赛人员")
        verbose_name_plural = verbose_name
