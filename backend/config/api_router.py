from django.conf import settings
from rest_framework.routers import DefaultRouter
from rest_framework.routers import SimpleRouter

from backend.components.views import ComponentViewSet
from backend.datasource.views import DatasourceViewSet
from backend.lesson.views.views_chapter import ChapterViewSet
from backend.lesson.views.views_lesson import LessonViewSet
from backend.project.views.views_cos import CosViewSet
from backend.project.views.views_file import FileViewSet
from backend.project.views.views_project import ProjectViewSet
from backend.project.views.views_team import TeamViewSet
from backend.users.api.views import UserViewSet

router = DefaultRouter() if settings.DEBUG else SimpleRouter()

router.register("users", UserViewSet, basename="users")
router.register("datasource", DatasourceViewSet, basename='datasource')
router.register("project", ProjectViewSet, basename="project")
router.register("team", TeamViewSet, basename='team')
router.register('component', ComponentViewSet, basename='component')
router.register('cos', CosViewSet, basename='cos')
router.register('lesson', LessonViewSet, basename='lesson')
router.register('chapter', ChapterViewSet, basename='chapter')
router.register('file', FileViewSet, basename='file')


app_name = "api"
urlpatterns = router.urls
