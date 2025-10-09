from django.db.models import Q
from django.shortcuts import render

# Create your views here.
from rest_framework.decorators import action
from rest_framework.response import Response

from backend.components.models import Component, ComponentCategory, ComponentFavorites
from backend.components.serializers import ComponentCategorySerializer, ComponentSerializer, \
    ProjectCategoriesQuerySerializer, FavoritesChangeSerializer, ComponentFavoritesSerializer
from common.drf.viewsets import APIModelViewSet


class ComponentViewSet(APIModelViewSet):

    serializer_class = ComponentSerializer

    def get_queryset(self):
        user = self.request.user
        return Component.objects.get_queryset().filter(Q(genre='common') | Q(created_by=user.username))

    @action(methods=['GET'], detail=False)
    def project_categories(self, request, *args, **kwargs):
        data = self.get_validated_params(ProjectCategoriesQuerySerializer, request.query_params)
        return Response(
            ComponentCategorySerializer(
                ComponentCategory.objects.filter(is_deleted=False),
                many=True,
                context={
                    'user': request.user,
                    'project_id': data.get('project_id')
                }
            ).data
        )

    @action(methods=['GET'], detail=False)
    def project_favorites(self, request, *args, **kwargs):
        """
        收藏的组件
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        data = self.get_validated_params(ProjectCategoriesQuerySerializer, request.query_params)
        favorites = ComponentFavorites.objects.filter(
            username=request.user.username, project_id=data.get('project_id')
        ).order_by('-pk')
        component_id = favorites.values_list('component_id', flat=True)

        # components = self.get_queryset().filter(pk__in=component_id)
        return Response(component_id)
        # return Response(
        #     self.get_serializer(components, many=True, context={
        #         'user': request.user,
        #         'favorites': list(favorites.values('id', 'component_id')),
        #         'favorite_component_ids': list(component_id),
        #         'project_id': data.get('project_id'),
        #         'action': 'project_favorites'
        #     }).data
        # )

    @action(methods=['POST'], detail=False)
    def add_project_favorites(self, request, *args, **kwargs):
        """
        添加收藏
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        data = self.get_validated_params(FavoritesChangeSerializer, request.data)
        component_ids = data.get('component_ids')
        f = list(ComponentFavorites.objects.filter(
            component_id__in=component_ids, username=request.user.username, project_id=data.get('project_id')
        ).values_list('component_id', flat=True))
        new_favorites = [
            ComponentFavorites(
                component_id=component_id, username=request.user.username, project_id=data.get('project_id')
            ) for component_id in
            list(filter(lambda item: item not in f, component_ids))
        ]
        new_favorites = ComponentFavorites.objects.bulk_create(new_favorites)
        return Response(ComponentFavoritesSerializer(new_favorites, many=True).data)

    @action(methods=['POST'], detail=False)
    def remove_project_favorites(self, request, *args, **kwargs):
        """
        移除收藏
        :param request:
        :param args:
        :param kwargs:
        :return:
        """
        data = self.get_validated_params(FavoritesChangeSerializer, request.data)
        component_ids = data.get('component_ids')
        f = ComponentFavorites.objects.filter(
            component_id__in=component_ids, username=request.user.username, project_id=data.get('project_id')
        )
        f.delete()
        return Response(ComponentFavoritesSerializer(f, many=True).data)
