import re
from django.core.exceptions import PermissionDenied
from django.http import HttpResponseRedirect
from django.shortcuts import render

from revproxy.views import ProxyView
# Create your views here.
from backend.project.models import Project, ProjectUser
from config.settings.base import JUPYTERHUB_HOST


class HubProxyView(ProxyView):
    upstream = JUPYTERHUB_HOST

    def dispatch(self, request, path):
        if not request.user.is_authenticated:
            return HttpResponseRedirect('/login')
        project_id = re.search(r'project_(\d+)', request.path)
        if not ProjectUser.objects.filter(
            username=request.user.username, project_id=project_id, is_deleted=False
        ).exists():
            raise PermissionDenied()
        return super().dispatch(request, request.path)
