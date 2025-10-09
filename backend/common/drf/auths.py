from django.contrib.auth import get_user_model
from rest_framework.authentication import BaseAuthentication, TokenAuthentication
from rest_framework.exceptions import AuthenticationFailed


class TestAuthentication(BaseAuthentication):
    """
    仅用于本地开发，强制用第一个超级管理员用户,授权
    """

    def authenticate(self, request):
        user = get_user_model()
        u = user.objects.all().filter(is_superuser=True).first()
        return u, None


class TAPIAuthentication(TokenAuthentication):
    """
    对外api权限校验，只允许子账号访问
    """

    def authenticate(self, request):
        user, token = super(TAPIAuthentication, self).authenticate(request)
        if user.is_sub_account:
            raise AuthenticationFailed()
        return user, token
