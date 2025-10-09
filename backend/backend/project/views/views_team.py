import datetime

from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from backend.project.models import TeamUser, Team
from backend.project.serializers import TeamSerializer, TeamCreateSerializer, TeamWithUsersSerializer, \
    TeamAddUserSerializer, TeamUserSerializer, TeamRemoveUserSerializer
from common.drf.page import DataPageNumberPagination
from common.drf.viewsets import APIModelViewSet


class TeamViewSet(APIModelViewSet):
    serializer_class = TeamSerializer
    pagination_class = DataPageNumberPagination

    def get_queryset(self):
        teams = Team.objects.get_queryset()
        if self.request.user.is_superuser:
            return teams.order_by('-pk')
        team_ids = TeamUser.objects.filter(
            username=self.request.user.username,
            is_deleted=False
        ).values_list('team_id')
        return teams.filter(pk__in=team_ids).order_by('-pk')

    def create(self, request, *args, **kwargs):
        data = self.get_validated_params(TeamCreateSerializer, request.data)
        created_by = request.user.username
        created_at = datetime.datetime.now()
        data["created_by"] = created_by
        data["created_at"] = created_at
        admins = data.pop('admins', [])
        admins.append(request.user.username)
        admins = list(set(admins))

        users = list(set(filter(lambda item: item not in admins, data.pop('users', []))))
        serializer_class = kwargs.pop("serializer", self.get_serializer)
        serializer = serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        team_id = serializer.data.get('id')
        admin_users = [
            TeamUser(
                team_id=team_id, username=username, level='admin', created_by=created_by,
                created_at=created_at, updated_by=created_by, updated_at=created_at
            ) for username in admins
        ]
        normal_users = [
            TeamUser(
                team_id=team_id, username=username, level='normal', created_by=created_by,
                created_at=created_at, updated_by=created_by, updated_at=created_at
            ) for username in users
        ]
        TeamUser.objects.bulk_create(admin_users + normal_users)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        user = request.user
        if user.is_superuser or TeamUser.objects.filter(
            is_deleted=False, username=user.username, team_id=instance.id, level='admin'
        ).exists():
            serializer = TeamWithUsersSerializer(instance, context={'user': request.user})
        else:
            serializer = self.get_serializer(instance)
        return Response(serializer.data)

    @action(detail=True, methods=['POST'])
    def add_users(self, request, *args, **kwargs):
        """
        新增团队成员
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        updated_by = request.user.username
        updated_at = datetime.datetime.now()
        team = self.get_object()
        if not TeamUser.objects.filter(
            username=request.user.username, team_id=team.id, is_deleted=False, level='admin'
        ).exists() and not request.user.is_superuser:
            raise PermissionDenied()
        data = self.get_validated_params(TeamAddUserSerializer, request.data)

        if data.get('level') == 'normal' and not TeamUser.objects.filter(
            team_id=team.id, is_deleted=False, level='admin').exclude(username__in=data.get('users')
        ).exists():
            raise Exception('请先将管理员权限移交至其他成员')

        exists_users = TeamUser.objects.filter(username__in=data.get('users'), team_id=team.id, is_deleted=False)
        exists_users.update(
            level=data.get('level'),
            updated_at=updated_at,
            updated_by=updated_by
        )
        new_usernames = set(data.get('users')) - set(exists_users.values_list('username'))
        new_users = [
            TeamUser(
                team_id=team.id, username=username, level=data.get('level'), created_by=updated_by,
                created_at=updated_at, updated_by=updated_by, updated_at=updated_at
            ) for username in new_usernames
        ]
        new_users = TeamUser.objects.bulk_create(new_users)

        return Response(TeamUserSerializer(list(exists_users) + new_users, many=True).data)

    @action(detail=True, methods=['POST'])
    def remove_users(self, request, *args, **kwargs):
        team = self.get_object()
        if not TeamUser.objects.filter(
            username=request.user.username, team_id=team.id, is_deleted=False, level='admin'
        ).exists() and not request.user.is_superuser:
            raise PermissionDenied()
        data = self.get_validated_params(TeamRemoveUserSerializer, request.data)
        if not TeamUser.objects.filter(
            team_id=team.id, is_deleted=False, level='admin').exclude(username__in=data.get('users')
        ).exists():
            raise Exception('请先将管理员权限移交至其他成员')
        team_users = TeamUser.objects.filter(username__in=data.get('users'), team_id=team.id, is_deleted=False)
        team_users.update(
            is_deleted=True,
            deleted_at=datetime.datetime.now(),
            deleted_by=request.user.username
        )
        return Response(TeamUserSerializer(team_users, many=True).data)
