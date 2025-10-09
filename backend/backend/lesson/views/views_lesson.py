from rest_framework.response import Response

from backend.lesson.models import Lesson
from backend.lesson.serializers import LessonSerializer
from common.drf.viewsets import APIModelViewSet


class LessonViewSet(APIModelViewSet):

    serializer_class = LessonSerializer

    def get_queryset(self):
        return Lesson.objects.get_queryset().order_by('-pk')

    def retrieve(self, request, *args, **kwargs) -> Response:
        instance = self.get_object()
        serializer = LessonSerializer(instance, context={
            'detail': True,
            **self.get_serializer_context()
        })
        # serializer = self.get_serializer(instance)
        return Response(serializer.data)
