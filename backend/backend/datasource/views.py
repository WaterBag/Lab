from django.db.models import Q
from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, JSONParser, FormParser
from rest_framework.response import Response

from backend.datasource.models import Datasource, DatasourceFavorites
from backend.datasource.serializers import DatasourceSerializer, FileUploadSerializer, FavoritesChangeSerializer, \
    DatasourceFavoritesSerializer
from backend.project.models import TeamUser
from common.cos.handler import CosHandler
from common.drf.page import DataPageNumberPagination
from common.drf.viewsets import APIModelViewSet


class DatasourceViewSet(APIModelViewSet):
    """
    文件上传有两种方式，
    * 一种是获取腾讯云cos的上传链接（公网部署模式）
    * 另一种是上传到本地（单机部署模式）请到project/views/file接口中调用
    """
    serializer_class = DatasourceSerializer
    search_fields = ("name", "description", "created_by")
    pagination_class = DataPageNumberPagination
    filter_fields = ("team_id", 'belong',)
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    def get_serializer_context(self):
        return {
            'user': self.request.user,
            'favorites': list(
                DatasourceFavorites.objects.filter(
                    username=self.request.user.username
                ).values_list('datasource_id', flat=True)
            )
        }

    def get_queryset(self):
        datasource = Datasource.objects.get_queryset()
        user = self.request.user
        if user.is_superuser:
            return datasource.order_by('-pk')
        team_ids = TeamUser.objects.filter(
            username=self.request.user.username, is_deleted=False
        ).values_list('team_id')
        return datasource.filter(
            Q(team_id__in=team_ids, belong='team') | Q(belong='public') | Q(created_by=user.username)
        ).order_by('-pk')

    @action(methods=['POST'], detail=False)
    def upload_url(self, request, *args, **kwargs):
        data = self.get_validated_params(FileUploadSerializer, request.data)
        return Response(
            CosHandler.get_presigned_url(
                data.get('key'),
                {
                    'x-web': 'lab',
                    'x-key': data.get('path_id')
                }
            )
        )

    @action(methods=['POST'], detail=True)
    def preview_url(self, request, *args, **kwargs):
        instance = self.get_object()
        return Response(
            CosHandler.get_presigned_url(
                f'/{instance.path}/{request.data.get("name")}',
                method='GET'
            )
        )

    @action(methods=['POST'], detail=True)
    def tmp_auth(self, request, *args, **kwargs):
        return Response()

    @action(methods=['GET'], detail=False)
    def my(self, request, *args, **kwargs):
        """
        我的数据集
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        queryset = self.filter_queryset(self.get_queryset())

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(methods=['GET'], detail=False)
    def favorites(self, request, *args, **kwargs):
        """
        收藏的数据集
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        datasource_id = DatasourceFavorites.objects.filter(
            username=request.user.username
        ).values_list('datasource_id', flat=True)
        datasource = self.get_queryset().filter(pk__in=datasource_id)
        page = self.paginate_queryset(datasource)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        return Response(self.get_serializer(datasource, many=True).data)

    @action(methods=['POST'], detail=False)
    def add_favorites(self, request, *args, **kwargs):
        """
        添加收藏
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        data = self.get_validated_params(FavoritesChangeSerializer, request.data)
        datasource_ids = data.get('datasource_ids')
        f = list(DatasourceFavorites.objects.filter(
            datasource_id__in=datasource_ids, username=request.user.username
        ).values_list('datasource_id', flat=True))
        new_favorites = [
            DatasourceFavorites(datasource_id=datasource_id, username=request.user.username) for datasource_id in
            list(filter(lambda item: item not in f, datasource_ids))
        ]
        new_favorites = DatasourceFavorites.objects.bulk_create(new_favorites)
        return Response(DatasourceFavoritesSerializer(new_favorites, many=True).data)

    @action(methods=['POST'], detail=False)
    def remove_favorites(self, request, *args, **kwargs):
        """
        移除收藏
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        data = self.get_validated_params(FavoritesChangeSerializer, request.data)
        datasource_ids = data.get('datasource_ids')
        f = DatasourceFavorites.objects.filter(
            datasource_id__in=datasource_ids, username=request.user.username
        )
        f.delete()
        return Response(DatasourceFavoritesSerializer(f, many=True).data)
