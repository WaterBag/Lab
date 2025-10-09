from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.viewsets import GenericViewSet

from backend.users.models import User
from common.drf.mixins import ResponseMixin

from .serializers import UserSerializer, NormalUserSerializer


class UserViewSet(ResponseMixin, GenericViewSet):
    serializer_class = UserSerializer
    queryset = User.objects.all()
    lookup_field = "username"

    def get_queryset(self, *args, **kwargs):
        assert isinstance(self.request.user.id, int)
        return self.queryset.filter(id=self.request.user.id)

    @action(detail=False)
    def me(self, request):
        serializer = UserSerializer(request.user, context={"request": request})
        return Response(status=status.HTTP_200_OK, data=serializer.data)

    def list(self, request, *args, **kwargs):
        s = NormalUserSerializer
        if request.user.is_superuser:
            s = UserSerializer
        return Response(s(User.objects.all(), many=True).data)
