from allauth.account.utils import has_verified_email
from django.utils.translation import gettext_lazy as _
from rest_framework.permissions import BasePermission
from rest_framework.exceptions import APIException, NotAuthenticated


class NotLoginException(APIException):
    status_code = 401


class NotVerifiedEmailException(APIException):
    status_code = 401


class IsAuthenticated(BasePermission):
    """
    Allows access only to authenticated users.
    """

    def has_permission(self, request, view):
        if not bool(request.user and request.user.is_authenticated):
            raise NotLoginException(_("用户身份未认证或认证错误"))
        if not request.path.startswith('/api/users/me'):
            if not has_verified_email(request.user):
                raise NotVerifiedEmailException(_('用户邮箱未校验'))
        return True
