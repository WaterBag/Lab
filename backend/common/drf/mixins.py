import datetime
import logging

from rest_framework import status
from rest_framework.exceptions import ErrorDetail
from rest_framework.response import Response

logger = logging.getLogger("app")


class ResponseMixin:
    def finalize_response(self, request, response, *args, **kwargs):
        """
        异常处理函数，搭配custom_exception_handler进行处理
        :param request:
        :param response:
        :param args:
        :param kwargs:
        :return:
        """
        if isinstance(response, Response):
            if not response.exception:
                response.data = {
                    "result": True,
                    "data": response.data,
                    "code": 200,
                    "message": "ok",
                }
            else:
                def parse_errors(error):
                    if isinstance(error, list):
                        return ';'.join(error)
                    else:
                        return str(error)
                try:
                    message = '\n'.join(
                        [key + ':' + parse_errors(item) for key, item in response.data.items()]
                    )
                except:
                    message = str(response.data)
                response.data = {
                    "result": False,
                    "data": response.data,
                    "code": response.status_code,
                    "message": message,
                    "error": response.data,
                }
                # logger.exception(str(response.data))
            response.status_code = status.HTTP_200_OK
            response.is_log_resp = True
        return super().finalize_response(request, response, *args, **kwargs)


class CreateMixin:
    def create(self, request, *args, **kwargs):
        data = request.data.copy()
        data["created_by"] = request.user.username
        data["created_at"] = datetime.datetime.now()
        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )


class ActionViewSetMixin:
    def destroy_mixin(self, request):
        instance = self.get_object()
        data = {
            "deleted_by": request.user.username,
            "deleted_at": datetime.datetime.now(),
            "is_deleted": True,
        }
        serializer = self.get_serializer(instance, data=data, partial=True)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        return self.destroy_mixin(request)

    def update_mixin(self, request, serializer):
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        data["updated_by"] = request.user.username
        data["updated_at"] = datetime.datetime.now()
        partial = True
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        if getattr(instance, "_prefetched_objects_cache", None):
            # If 'prefetch_related' has been applied to a queryset, we need to
            # forcibly invalidate the prefetch cache on the instance.
            instance._prefetched_objects_cache = {}

        return serializer.data

    def create_mixin(self, request, *args, **kwargs):
        data = request.data.copy()
        data["created_by"] = request.user.username
        data["created_at"] = datetime.datetime.now()
        serializer_class = kwargs.pop("serializer", self.get_serializer)
        serializer = serializer_class(data=data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return serializer.data

    def create(self, request, *args, **kwargs):
        data = self.create_mixin(request, *args, **kwargs)
        headers = self.get_success_headers(data)
        return Response(data, status=status.HTTP_201_CREATED, headers=headers)
