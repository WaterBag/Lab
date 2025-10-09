from django.core.paginator import InvalidPage
from django.core.paginator import Paginator as DjangoPaginator
from django.utils.functional import cached_property
from rest_framework.exceptions import NotFound
from rest_framework.pagination import (
    PageNumberPagination,
    _get_displayed_page_numbers,
    _get_page_links,
    _positive_int,
)
from rest_framework.response import Response
from rest_framework.utils.urls import remove_query_param, replace_query_param


class DataPaginator(DjangoPaginator):
    def validate_number(self, number):
        """
        覆盖默认方法，去掉最大无效page校验
        :param number:
        :return:
        """
        try:
            if isinstance(number, float) and not number.is_integer():
                raise ValueError
            number = int(number)
        except (TypeError, ValueError):
            return super(DataPaginator, self).validate_number(number)
        if number < 1:
            return super(DataPaginator, self).validate_number(number)
        return number

    def page(self, number):
        if getattr(self, "_page_enabled", True):
            return super(DataPaginator, self).page(number)
        else:
            # 返回所有的数据
            return self._get_page(self.object_list[:], number, self)


class DataPageNumberPagination(PageNumberPagination):
    page_size = 10
    page_query_param = "page"
    page_size_query_param = "page_size"
    max_page_size = 1000

    django_paginator_class = DataPaginator

    def get_paginated_response(self, data):
        return Response({"count": self.page.paginator.count, "results": data})

    def get_html_context(self):
        """
        去除默认最大页限制
        :return:
        """
        base_url = self.request.build_absolute_uri()

        def page_number_to_url(page_number):
            if page_number == 1:
                return remove_query_param(base_url, self.page_query_param)
            else:
                return replace_query_param(base_url, self.page_query_param, page_number)

        current = self.page.number
        final = self.page.paginator.num_pages
        if current < final:
            page_numbers = _get_displayed_page_numbers(current, final)
        else:
            page_numbers = _get_displayed_page_numbers(final, final)
        page_links = _get_page_links(page_numbers, current, page_number_to_url)

        return {
            "previous_url": self.get_previous_link(),
            "next_url": self.get_next_link(),
            "page_links": page_links,
        }

    def paginate_queryset(self, queryset, request, view=None):
        """
        覆盖默认方法，从 self.page_params 中获取参数
        :param queryset:
        :param request:
        :param view:
        :return:
        """
        self.request = request

        page_size = self.get_page_size(request)
        if not page_size:
            return None

        paginator = self.django_paginator_class(queryset, page_size)
        # 默认为True
        page_enabled = self.page_params.get("page_enabled", True)
        if page_enabled == "false":
            page_enabled = False
        setattr(paginator, "_page_enabled", page_enabled)
        page_number = self.page_params.get(self.page_query_param, 1)
        if page_number in self.last_page_strings:
            page_number = paginator.num_pages

        try:
            self.page = paginator.page(page_number)
        except InvalidPage as exc:
            msg = self.invalid_page_message.format(
                page_number=page_number, message=str(exc)
            )
            raise NotFound(msg)

        if paginator.num_pages > 1 and self.template is not None:
            # The browsable API should display pagination controls.
            self.display_page_controls = True

        return list(self.page)

    @cached_property
    def page_params(self):
        """
        获取分页的参数
        :return:
        """
        if self.request.method == "POST":
            return self.request.data
        return self.request.query_params

    def get_page_size(self, request):
        """
        覆盖默认方法，从 self.page_params 中获取参数
        :param request:
        :return:
        """
        if self.page_size_query_param:
            try:
                return _positive_int(
                    self.page_params[self.page_size_query_param],
                    strict=True,
                    cutoff=self.max_page_size,
                )
            except (KeyError, ValueError):
                pass

        return self.page_size
