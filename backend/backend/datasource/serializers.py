import json

from rest_framework import serializers

from backend.datasource.models import Datasource, DatasourceFavorites
from backend.project.models import Team


class TeamSerializer(serializers.ModelSerializer):

    class Meta:
        model = Team
        fields = '__all__'


class DatasourceSerializer(serializers.ModelSerializer):

    team_id = serializers.IntegerField(allow_null=True, required=False)
    file_list = serializers.CharField(write_only=True)
    image = serializers.ImageField(allow_null=True, allow_empty_file=True, required=False)

    class Meta:
        model = Datasource
        fields = '__all__'

    def validate(self, attrs):
        attrs['files'] = json.loads(attrs['file_list'])
        del attrs['file_list']
        ret = super(DatasourceSerializer, self).validate(attrs)
        return ret

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        favorites = self.context.get('favorites', [])
        ret['team'] = TeamSerializer(Team.objects.filter(pk=instance.team_id, is_deleted=False).first()).data
        ret['favorite'] = instance.pk in favorites
        return ret


class FileUploadSerializer(serializers.Serializer):

    key = serializers.CharField()
    path_id = serializers.CharField()


class TmpSecretSerializer(serializers.Serializer):
    path = serializers.CharField()


class FavoritesChangeSerializer(serializers.Serializer):
    datasource_ids = serializers.ListSerializer(child=serializers.IntegerField())


class DatasourceFavoritesSerializer(serializers.ModelSerializer):

    class Meta:
        model = DatasourceFavorites
        fields = '__all__'
