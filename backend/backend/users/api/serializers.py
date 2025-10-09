from allauth.account.utils import has_verified_email
from rest_framework import serializers

from backend.users.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["username", "name", "is_superuser", 'org', 'name', 'real_name']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['has_verified_email'] = has_verified_email(instance)
        ret['name'] = ret.get('name', '') or ret.get('real_name', '')
        return ret


class NormalUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['name', 'username', 'email', 'real_name']

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        ret['name'] = ret.get('name', '') or ret.get('real_name', '')
        del ret['real_name']
        return ret
