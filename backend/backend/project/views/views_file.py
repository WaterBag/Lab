from rest_framework.parsers import MultiPartParser, FormParser, JSONParser

from backend.project.models import LocalFile
from backend.project.serializers import LocalFileSerializer
from common.drf.viewsets import APIModelViewSet


class FileViewSet(APIModelViewSet):

    parser_classes = (MultiPartParser, FormParser, JSONParser)
    serializer_class = LocalFileSerializer

    def get_queryset(self):
        return LocalFile.objects.filter(is_deleted=False)

