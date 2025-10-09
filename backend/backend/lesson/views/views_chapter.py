# Create your views here.
from backend.lesson.models import Chapter
from backend.lesson.serializers import ChapterSerializer
from common.drf.viewsets import APIModelViewSet


class ChapterViewSet(APIModelViewSet):

    serializer_class = ChapterSerializer

    filter_fields = ('lesson_id', )

    def get_queryset(self):
        return Chapter.objects.get_queryset().order_by('-pk')

