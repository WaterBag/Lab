# from allauth.account.forms import SignupForm
# from allauth.socialaccount.forms import SignupForm as SocialSignupForm
from django import forms
from django.contrib.auth import forms as admin_forms
from django.utils.translation import gettext_lazy as _

from .models import User


class UserAdminChangeForm(admin_forms.UserChangeForm):
    class Meta(admin_forms.UserChangeForm.Meta):  # type: ignore[name-defined]
        model = User


class UserAdminCreationForm(admin_forms.UserCreationForm):
    """
    Form for User Creation in the Admin Area.
    To change user signup, see UserSignupForm and UserSocialSignupForm.
    """

    class Meta(admin_forms.UserCreationForm.Meta):  # type: ignore[name-defined]
        model = User
        error_messages = {
            "username": {"unique": _("This username has already been taken.")},
        }


class UserSignupForm(forms.Form):
    """
    Form that will be rendered on a user sign up section/screen.
    Default fields will be added automatically.
    Check UserSocialSignupForm for accounts created from social.
    """
    org = forms.CharField(
        required=True,
        label=_("机构"),
        max_length=255,
        widget=forms.TextInput(
            attrs={"placeholder": _("机构")}
        ),
    )
    real_name = forms.CharField(
        required=True,
        label=_("真实姓名"),
        max_length=255,
        widget=forms.TextInput(
            attrs={"placeholder": _("真实姓名")}
        ),
    )

    def signup(self, request, user):
        pass


class UserSocialSignupForm(forms.Form):
    """
    Renders the form when user has signed up using social accounts.
    Default fields will be added automatically.
    See UserSignupForm otherwise.
    """
