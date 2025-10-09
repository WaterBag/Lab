from allauth.account.utils import send_email_confirmation
from django.contrib.auth import authenticate
from django.contrib.auth.mixins import LoginRequiredMixin
from django.contrib.messages.views import SuccessMessageMixin
from django.db.models import QuerySet
from django.http import JsonResponse
from django.urls import reverse
from django.utils.translation import gettext_lazy as _
from django.views.decorators.csrf import csrf_exempt
from django.views.generic import DetailView, RedirectView, UpdateView
import logging

logger = logging.getLogger(__name__)

from backend.users.models import User


class UserDetailView(LoginRequiredMixin, DetailView):
    model = User
    slug_field = "username"
    slug_url_kwarg = "username"


user_detail_view = UserDetailView.as_view()


class UserUpdateView(LoginRequiredMixin, SuccessMessageMixin, UpdateView):
    model = User
    fields = ["name"]
    success_message = _("Information successfully updated")

    def get_success_url(self) -> str:
        assert self.request.user.is_authenticated  # type guard
        return self.request.user.get_absolute_url()

    def get_object(self, queryset: QuerySet | None = None) -> User:
        assert self.request.user.is_authenticated  # type guard
        return self.request.user


user_update_view = UserUpdateView.as_view()


class UserRedirectView(LoginRequiredMixin, RedirectView):
    permanent = False

    def get_redirect_url(self) -> str:
        return reverse("users:detail", kwargs={"username": self.request.user.username})


user_redirect_view = UserRedirectView.as_view()


@csrf_exempt

def email_confirmation(request, *args, **kwargs):
    """Resend email confirmation.

    Use the email provided by the frontend (JSON body: {"email": "..."}).
    Does not rely on any stashed or logged-in user state.
    """
    try:
        import json
        body = json.loads(getattr(request, "body", b"") or b"{}")
        email = body.get("email")
    except Exception:
        email = None

    if not email:
        mail_msg = _("Email sending failed, please retry later")
        msg = {"code": 400, "data": mail_msg, "message": mail_msg, "results": False}
        return JsonResponse(msg, content_type="application/json")

    user = User.objects.filter(email=email).first()
    if not user:
        mail_msg = _("Email sending failed, please retry later")
        msg = {"code": 400, "data": mail_msg, "message": mail_msg, "results": False}
        return JsonResponse(msg, content_type="application/json")

    sent = send_email_confirmation(request, user)
    if sent:
        mail_msg = _("Email sent successfully")
        msg = {"code": 200, "data": mail_msg, "message": mail_msg, "results": sent}
    else:
        mail_msg = _("Email sending failed, please retry later")
        msg = {"code": 500, "data": mail_msg, "message": mail_msg, "results": sent}
    return JsonResponse(msg, content_type="application/json")


@csrf_exempt

def user_login(request, *args, **kwargs):
    import json
    from django.contrib.auth import login

    try:
        body = json.loads(request.body)
    except Exception:
        body = {}

    username = body.get("username")
    password = body.get("password")
    user = authenticate(request, username=username, password=str(password))
    if user:
        login(request, user)
        msg = {"code": 200, "data": _("登录成功"), "message": _("登录成功"), "results": True}
        return JsonResponse(msg, content_type="application/json")

    logger.info('login failed with body: %s', body)
    msg = {
        "code": 400,
        "data": _("用户名或密码错误"),
        "message": _("用户名或密码错误"),
        "results": False,
    }
    return JsonResponse(msg, content_type="application/json")
