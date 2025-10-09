from rest_framework.viewsets import ModelViewSet, ViewSet

from common.drf.mixins import ActionViewSetMixin, ResponseMixin


class APIViewSet(ResponseMixin, ViewSet):
    extra_permissions = []

    def refuse_wrapper_response(self):
        setattr(self.request, "_wrapper_response", False)

    def get_permissions(self):
        results = []
        for permission in self.permission_classes:
            results.append(permission())
        for permission in self.extra_permissions:
            results.append(permission())
        return results

    @classmethod
    def get_validated_params(cls, serializer, params):
        s = serializer(data=params)
        s.is_valid(raise_exception=True)
        return s.validated_data


class APIModelViewSet(ActionViewSetMixin, ResponseMixin, ModelViewSet):
    extra_permissions = []  # 不覆盖默认的权限

    def get_serializer_context(self):
        return {
            'request': self.request,
            'format': self.format_kwarg,
            'view': self,
            'user': self.request.user
        }

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        results = []
        for permission in self.permission_classes:
            results.append(permission())
        for permission in self.extra_permissions:
            results.append(permission())
        return results

    def get_validated_params(self, serializer, params, context=None):
        if context is None:
            context = self.get_serializer_context()
        s = serializer(data=params, context=context)
        s.is_valid(raise_exception=True)
        return s.validated_data
