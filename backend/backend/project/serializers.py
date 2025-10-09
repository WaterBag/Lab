from rest_framework import serializers

from backend.project.models import Project, Team, TeamUser, ProjectUser, LocalFile
from common.user import User
from config.settings.base import JUPYTERHUB_COMMON_USER


class TeamUserInfoSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['name', 'username', 'email', 'real_name']

    def to_representation(self, instance):
        ret = super(TeamUserInfoSerializer, self).to_representation(instance)
        ret['level'] = self.context.get('level', 'normal')
        ret['name'] = ret.get('name') or ret.get('real_name')
        return ret


class ProjectUserInfoSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ['name', 'username', 'email', 'real_name']

    def to_representation(self, instance):
        ret = super(ProjectUserInfoSerializer, self).to_representation(instance)
        ret['level'] = self.context.get('level', 'normal')
        ret['name'] = ret.get('name') or ret.get('real_name')
        return ret


class ProjectSerializer(serializers.ModelSerializer):

    class Meta:
        model = Project
        fields = '__all__'

    def to_representation(self, instance):
        ret = super(ProjectSerializer, self).to_representation(instance)
        # ret['server_url'] = f'/ide/user//project_{instance.id}/lab'
        ret['server_url'] = f'/ide/hub/spawn/{JUPYTERHUB_COMMON_USER}/project_{instance.id}'
        team = Team.objects.filter(pk=instance.team_id, is_deleted=False).first()
        ret['team'] = TeamSerializer(team).data
        return ret


class ProjectWithUsersSerializer(ProjectSerializer):

    def to_representation(self, instance):
        ret = super(ProjectWithUsersSerializer, self).to_representation(instance)
        user = self.context.get('user')
        ret['is_admin'] = ProjectUser.objects.filter(
            level='admin', username=user.username, is_deleted=False, project_id=instance.pk
        ).exists()
        members = ProjectUser.objects.filter(is_deleted=False, project_id=instance.pk)
        admins = ProjectUserInfoSerializer(
            User.objects.filter(
                username__in=members.filter(level='admin').values_list('username')
            ), many=True, context={'level': 'admin'}
        ).data
        users = ProjectUserInfoSerializer(
            User.objects.filter(
                username__in=members.filter(level='normal').values_list('username')
            ), many=True, context={'level': 'normal'}
        ).data
        ret['users'] = list(admins) + list(users)
        return ret


class TeamSerializer(serializers.ModelSerializer):

    class Meta:
        model = Team
        fields = '__all__'


class TeamWithUsersSerializer(serializers.ModelSerializer):

    class Meta:
        model = Team
        fields = '__all__'

    def to_representation(self, instance):
        ret = super(TeamWithUsersSerializer, self).to_representation(instance)
        members = TeamUser.objects.filter(is_deleted=False, team_id=instance.pk)
        admins = TeamUserInfoSerializer(
            User.objects.filter(
                username__in=members.filter(level='admin').values_list('username')
            ), many=True, context={'level': 'admin'}
        ).data
        users = TeamUserInfoSerializer(
            User.objects.filter(
                username__in=members.filter(level='normal').values_list('username')
            ), many=True, context={'level': 'normal'}
        ).data
        ret['users'] = list(admins) + list(users)
        ret['is_admin'] = True
        return ret


class TeamCreateSerializer(serializers.Serializer):
    name = serializers.CharField()
    users = serializers.ListSerializer(child=serializers.CharField())
    admins = serializers.ListSerializer(child=serializers.CharField())
    description = serializers.CharField(allow_blank=True, allow_null=True)


class TeamAddUserSerializer(serializers.Serializer):
    users = serializers.ListSerializer(child=serializers.CharField())
    level = serializers.CharField()


class TeamRemoveUserSerializer(serializers.Serializer):
    users = serializers.ListSerializer(child=serializers.CharField())


class ProjectRemoveUserSerializer(serializers.Serializer):
    users = serializers.ListSerializer(child=serializers.CharField())


class TeamUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = TeamUser
        fields = '__all__'


class ProjectCreateSerializer(serializers.ModelSerializer):

    users = serializers.ListSerializer(child=serializers.CharField())

    class Meta:
        model = Project
        fields = '__all__'


class ProjectUserUpdateSerializer(serializers.Serializer):

    users = serializers.ListSerializer(child=serializers.CharField())
    level = serializers.CharField()


class ProjectUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = ProjectUser
        fields = '__all__'


class CosTempCredentialSerializer(serializers.Serializer):

    prefix = serializers.CharField()


class LocalFileSerializer(serializers.ModelSerializer):

    class Meta:
        model = LocalFile
        fields = '__all__'
