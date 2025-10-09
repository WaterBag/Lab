from rest_framework.decorators import action
from rest_framework.response import Response

from backend.project.serializers import CosTempCredentialSerializer
from common.cos.handler import CosHandler
from common.drf.viewsets import APIViewSet


class CosViewSet(APIViewSet):

    @action(methods=['POST'], detail=False)
    def temp_credential(self, request, *args, **kwargs):
        data = self.get_validated_params(CosTempCredentialSerializer, request.data)
        resp = CosHandler.get_temp_credential(data.get('prefix'))
        resp['cos'] = {
            'bucket': CosHandler.bucket_name,
            'region': CosHandler.region
        }
        return Response(resp)
