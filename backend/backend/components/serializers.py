from django.db.models import Q
from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied

from backend.components.models import ComponentCategory, Component, ComponentFavorites
from backend.project.models import ProjectUser


class ComponentCategorySerializer(serializers.ModelSerializer):

    class Meta:
        model = ComponentCategory
        fields = '__all__'

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        user = self.context.get('user')
        project_id = self.context.get('project_id')
        if project_id:
            components = Component.objects.filter(category=instance.key, is_deleted=False).filter(
                Q(genre='common') | Q(genre='project', project_id=project_id)
            )
        else:
            components = Component.objects.filter(category=instance.key, is_deleted=False, genre='common')
        ret['children'] = ComponentSerializer(components, many=True).data
        return ret


class ComponentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Component
        fields = '__all__'
    
    def validate(self, attrs):
        attrs['genre'] = 'project'
        return super(ComponentSerializer, self).validate(attrs)


def validate_user_permission(user, project_id):
    if user.is_superuser:
        return True
    if ProjectUser.objects.filter(
        project_id=project_id, username=user.username, is_deleted=False
    ).exists():
        return True
    raise PermissionDenied('无项目权限')


class ProjectCategoriesQuerySerializer(serializers.Serializer):

    project_id = serializers.IntegerField(allow_null=True)

    def validate(self, attrs):
        ret = super(ProjectCategoriesQuerySerializer, self).validate(attrs)
        user = self.context.get('user')
        validate_user_permission(user, ret.get('project_id'))
        return ret


class FavoritesChangeSerializer(serializers.Serializer):
    component_ids = serializers.ListSerializer(child=serializers.IntegerField())
    project_id = serializers.IntegerField()

    def validate(self, attrs):
        ret = super(FavoritesChangeSerializer, self).validate(attrs)
        user = self.context.get('user')
        validate_user_permission(user, ret.get('project_id'))
        return ret


class ComponentFavoritesSerializer(serializers.ModelSerializer):

    class Meta:
        model = ComponentFavorites
        fields = '__all__'
