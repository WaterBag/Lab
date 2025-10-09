import datetime

from django.shortcuts import render

# Create your views here.
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.exceptions import PermissionDenied
from rest_framework.response import Response

from backend.project.models import Project, ProjectUser, TeamUser
from backend.project.serializers import ProjectSerializer, ProjectCreateSerializer, ProjectUserUpdateSerializer, \
    ProjectUserSerializer, ProjectWithUsersSerializer, ProjectRemoveUserSerializer
from common.drf.page import DataPageNumberPagination
from common.drf.viewsets import APIModelViewSet
from common.jupyter import JupyterHandler


class ProjectViewSet(APIModelViewSet):

    serializer_class = ProjectSerializer
    pagination_class = DataPageNumberPagination
    search_fields = ("name",)
    # filter_fields = ("project_id",)

    def get_queryset(self):
        projects = Project.objects.get_queryset()
        if self.request.user.is_superuser:
            return projects.order_by('-pk')
        project_ids = ProjectUser.objects.filter(
            username=self.request.user.username, is_deleted=False
        ).values_list('project_id')
        return projects.filter(pk__in=project_ids).order_by('-pk')

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = ProjectWithUsersSerializer(instance, context={'user': request.user})
        return Response(serializer.data)

    def create(self, request, *args, **kwargs):
        users = self.get_validated_params(ProjectCreateSerializer, request.data).get('users', [])
        data = self.create_mixin(request, *args, **kwargs)
        headers = self.get_success_headers(data)
        project_id = data.get('id')
        created_by = request.user.username
        created_at = datetime.datetime.now()
        relations = [
            ProjectUser(
                project_id=project_id, username=username, level='normal', created_by=created_by, created_at=created_at
            ) for username in set(users)
        ]
        relations.append(
            ProjectUser(
                project_id=project_id, username=created_by, level='admin', created_by=created_by, created_at=created_at
            )
        )
        ProjectUser.objects.bulk_create(relations)
        resp = JupyterHandler.create_named_server(f'project_{project_id}')
        data['create_resp'] = resp
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=True, methods=['POST'])
    def update_users(self, request, *args, **kwargs):
        data = self.get_validated_params(ProjectUserUpdateSerializer, request.data)
        project = self.get_object()
        user = request.user
        if not user.is_superuser and not ProjectUser.objects.filter(
            username=user.username, is_deleted=False, project_id=project.id
        ).exists() and not TeamUser.objects.filter(
            level='admin', is_deleted=False, team_id=project.team_id, username=user.username
        ).exists():
            raise PermissionDenied()

        updated_at = datetime.datetime.now()
        updated_by = user.username

        exists_users = ProjectUser.objects.filter(
            username__in=data.get('users'), project_id=project.id, is_deleted=False
        )
        exists_users.update(
            level=data.get('level'),
            updated_at=updated_at,
            updated_by=updated_by
        )
        new_usernames = set(data.get('users')) - set(exists_users.values_list('username'))
        new_users = [
            ProjectUser(
                project_id=project.id, username=username, level=data.get('level'), created_by=updated_by,
                created_at=updated_at, updated_by=updated_by, updated_at=updated_at
            ) for username in new_usernames
        ]
        new_users = ProjectUser.objects.bulk_create(new_users)

        return Response(ProjectUserSerializer(list(exists_users) + new_users, many=True).data)

    @action(detail=True, methods=['POST'])
    def remove_users(self, request, *args, **kwargs):
        project = self.get_object()
        user = request.user
        if not ProjectUser.objects.filter(
            username=user.username, project_id=project.id, is_deleted=False, level='admin'
        ).exists() and not request.user.is_superuser and not TeamUser.objects.filter(
            username=user.username, team_id=project.team_id, is_deleted=False, level='admin'
        ).exists():
            raise PermissionDenied()
        data = self.get_validated_params(ProjectRemoveUserSerializer, request.data)
        project_users = ProjectUser.objects.filter(
            username__in=data.get('users'), project_id=project.id, is_deleted=False
        )
        project_users.update(
            is_deleted=True,
            deleted_at=datetime.datetime.now(),
            deleted_by=request.user.username
        )
        return Response(ProjectUserSerializer(project_users, many=True).data)

    @action(methods=['POST'], detail=True)
    def start_server(self, request, *args, **kwargs):
        project = self.get_object()
        project_id = project.id
        return Response(JupyterHandler.start_named_server(f'project_{project_id}'))

    @action(methods=['POST'], detail=True)
    def stop_server(self, request, *args, **kwargs):
        project = self.get_object()
        project_id = project.id
        return Response(JupyterHandler.stop_named_server(f'project_{project_id}'))
