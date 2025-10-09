from __future__ import annotations

import typing

from allauth.account.adapter import DefaultAccountAdapter
from allauth.socialaccount.adapter import DefaultSocialAccountAdapter
from allauth.account.models import EmailAddress
from allauth.account.utils import user_display, user_username, user_field, has_verified_email, user_email
from allauth.headless.adapter import DefaultHeadlessAdapter
from django.conf import settings


if typing.TYPE_CHECKING:
    from allauth.socialaccount.models import SocialLogin
    from django.http import HttpRequest

    from backend.users.models import User


class AccountAdapter(DefaultAccountAdapter):
    def is_open_for_signup(self, request: HttpRequest) -> bool:
        return getattr(settings, "ACCOUNT_ALLOW_REGISTRATION", True)

    def save_user(self, request, user, form, commit=True):
        """
        Saves a new `User` instance using information provided in the
        signup form.
        """

        data = form.cleaned_data
        first_name = data.get("first_name")
        last_name = data.get("last_name")
        real_name = data.get('real_name')
        org = data.get('org')
        email = data.get("email")
        username = data.get("username")
        user_email(user, email)
        user_username(user, username)
        if first_name:
            user_field(user, "first_name", first_name)
        if last_name:
            user_field(user, "last_name", last_name)
        if real_name:
            user_field(user, "real_name", real_name)
        if org:
            user_field(user, "org", org)
        if "password1" in data:
            user.set_password(data["password1"])
        elif "password" in data:
            user.set_password(data["password"])
        else:
            user.set_unusable_password()
        self.populate_username(request, user)
        if commit:
            # Ability not to commit makes it easier to derive from
            # this adapter by adding
            user.save()
        return user


class HeadlessAccountAdapter(DefaultHeadlessAdapter):

    def serialize_user(self, user):
        """
        Returns the basic user data. Note that this data is also exposed in
        partly authenticated scenario's (e.g. password reset, email
        verification).
        """
        ret = {
            "id": user.pk,
            "display": user_display(user),
            "has_usable_password": user.has_usable_password(),
        }
        email = EmailAddress.objects.get_primary_email(user)
        if email:
            ret["email"] = email
        username = user_username(user)
        if username:
            ret["username"] = username
        org = user_field(user, 'org')
        if org:
            ret['org'] = org
        real_name = user_field(user, 'real_name')
        if real_name:
            ret['real_name'] = real_name
        name = user_field(user, 'name')
        if name:
            ret['name'] = name
        else:
            ret['name'] = real_name
        ret['has_verified_email'] = has_verified_email(user)
        ret['is_superuser'] = user.is_superuser
        return ret


class SocialAccountAdapter(DefaultSocialAccountAdapter):
    def is_open_for_signup(
        self,
        request: HttpRequest,
        sociallogin: SocialLogin,
    ) -> bool:
        return getattr(settings, "ACCOUNT_ALLOW_REGISTRATION", True)

    def populate_user(
        self,
        request: HttpRequest,
        sociallogin: SocialLogin,
        data: dict[str, typing.Any],
    ) -> User:
        """
        Populates user information from social provider info.

        See: https://docs.allauth.org/en/latest/socialaccount/advanced.html#creating-and-populating-user-instances
        """
        user = super().populate_user(request, sociallogin, data)
        if not user.name:
            if name := data.get("name"):
                user.name = name
            elif first_name := data.get("first_name"):
                user.name = first_name
                if last_name := data.get("last_name"):
                    user.name += f" {last_name}"
        return user
