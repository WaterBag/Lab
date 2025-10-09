from rest_framework import serializers

from backend.lesson.models import Lesson, Chapter


class LessonSerializer(serializers.ModelSerializer):

    class Meta:
        model = Lesson
        fields = '__all__'

    def to_representation(self, instance):
        ret = super(LessonSerializer, self).to_representation(instance)
        if self.context.get('detail'):
            ret['chapters'] = ChapterSerializer(
                Chapter.objects.filter(lesson_id=instance.pk, is_deleted=False).order_by('pk'), many=True
            ).data
        return ret


class ChapterSerializer(serializers.ModelSerializer):

    class Meta:
        model = Chapter
        fields = '__all__'
