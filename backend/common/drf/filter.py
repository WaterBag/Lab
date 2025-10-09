from urllib import parse

import arrow
from django.conf import settings
from django.db.models import Q
from django.db.models.fields import BooleanField, DateField, NullBooleanField
from rest_framework.exceptions import ValidationError
from rest_framework.filters import BaseFilterBackend, SearchFilter


class CustomFilterBackend(BaseFilterBackend):
    list_split_identifier = "|"
    query_identify = "q"

    list_operation = ("in",)
    all_operations = (
        "lt",
        "lte",
        "gt",
        "gte",
        "contains",
        "icontains",
        "startswith",
        "endswith",
        "in",
        "date",
        "isnull",
    )

    def _init(self, request, queryset, view):
        self.request = request
        self.query = queryset
        self.view = view

    @property
    def allow_filter_fields(self):
        """
        允许过滤的字段
        :return:
        """
        return getattr(self.view, "custom_query_fields", [])

    @property
    def order_bys(self):
        """
        排序的字段
        :return:
        """
        allow_fields = getattr(self.view, "custom_order_by_fields", [])
        actual_fields = self.request.data.get("order_by", [])
        order_bys = [
            field for field in actual_fields if field.strip("-") in allow_fields
        ]
        return order_bys

    @property
    def query_params(self):
        """
        获得查询参数
        q=name=1,age=2 => {"name=": 1, "age=", 2}
        :return:
        """
        return dict(self.request.data)
        # query_params = dict()
        # pre_field = None
        # for raw in self.request.query_params.getlist(self.query_identify):
        #     operations = [x for x in raw.split(",") if len(x) != 0]
        #     for operation in operations:
        #         r = operation.split("=")
        #         if len(r) != 2:
        #             query_params[pre_field] += ",{}".format(operation)
        #             continue
        #         pre_field = r[0].strip()
        #         query_params[r[0].strip()] = r[1].strip()
        # if hasattr(self.view, "process_query_params"):
        #     func = getattr(self.view, "process_query_params")
        #     if func and callable(func):
        #         query_params = func(query_params)
        # return query_params

    def is_list_operation(self, param):
        return param.split("__")[-1] in self.list_operation

    @classmethod
    def get_query_kwargs(cls, param):
        """
        >>>"id__gte=3"
        >>>{"id_gte": 3}
        """
        left, right = param.split("=")
        return {left: right}

    def filter_queryset(self, request, queryset, view):
        self._init(request, queryset, view)
        query = self.add_order_by(queryset)
        self.query = query  # noqa, 避免覆盖
        query = self.get_filter_queryset()
        # print(query.query)
        return query

    def is_valid_param(self, param):
        """
        判断param是否是一个过滤字段
        :param param:
        :return:
        """
        field = "__".join(param.split("__")[:-1]).strip("^").strip("__")
        field = field or param
        may_op = param.split("__")[-1]
        if may_op in self.all_operations:
            tem = field
            field = "__".join(field.split("__")[:-1]).strip("^").strip("__")
            field = field or tem
        return (
            field.strip() in self.allow_filter_fields
            or field.split("__")[0] in self.allow_filter_fields
        )

    def get_model(self):
        return self.query.model

    def get_model_field(self, field_name, model):
        return model._meta.get_field(field_name)

    def get_last_model_field(self, field):
        """
        获取django模型的字段
        :param field:
        :return:
        """
        res = field.split("__")
        cur_model = self.get_model()
        last_field = None
        if res[-1] in self.all_operations:
            res = res[:-1]
        for index, name in enumerate(res):
            try:
                if isinstance(last_field, DateField) and name == "date":
                    last_field = last_field
                else:
                    last_field = cur_model._meta.get_field(name)
                if hasattr(last_field, "related_model") and last_field.related_model:
                    cur_model = last_field.related_model
            except Exception as e:
                print(e)
                last_field = None
        return last_field

    def _validate_value(self, model_field, value, field_name):
        if self.is_list_operation(field_name):
            values = value
        else:
            values = [value]

        for value in values:
            try:
                model_field.to_python(value)
            except Exception as e:
                raise ValidationError(str(e))

    def _process_value(self, field_name, value):
        model_field = self.get_last_model_field(field_name)
        if not model_field:
            return (
                parse.unquote(parse.unquote(value)) if isinstance(value, str) else value
            )
        if isinstance(model_field, (BooleanField, NullBooleanField)):
            if value == "true":
                value = True
            elif value == "false":
                value = False
        elif isinstance(model_field, DateField):
            to_date = "__date" in field_name
            try:
                time_value = (
                    arrow.get(value).replace(tzinfo=settings.TIME_ZONE).to("utc")
                )
                value = time_value.date() if to_date else time_value.datetime
            except Exception as e:
                print(str(e))
                raise Exception("%s is an valid time format" % value)
        value = parse.unquote(parse.unquote(value)) if isinstance(value, str) else value
        self._validate_value(model_field, value, field_name)
        return value

    def get_filter_queryset(self):
        query = self.query
        query_params = self.query_params

        filter_fields = dict()
        exclude_fields = dict()
        for field, value in query_params.items():
            if not value:
                continue
            if not str(field).startswith("^") and self.is_valid_param(field):
                filter_fields[field] = self._process_value(field, value)
            elif str(field).startswith("^") and self.is_valid_param(field.strip("^")):
                exclude_fields[field.strip("^")] = self._process_value(field, value)
        keys = {}
        for field, value in filter_fields.items():
            key = field.split("__")[0]
            keys.setdefault(key, [])
            s = keys.get(key)
            s.append(Q(**{field: value}))
        for _, qs in keys.items():
            query = query.filter(*qs)
        for field, value in exclude_fields.items():
            if self.is_list_operation(field):
                value = value.split(self.list_split_identifier)
            query = query.exclude(**{field: value})

        if hasattr(self.view, "custom_filter_query") and callable(
            self.view.custom_filter_query
        ):
            query = self.view.custom_filter_query(query, query_params)
        return query

    def add_order_by(self, query):
        if any(self.order_bys):
            query = query.order_by(*self.order_bys)

        return query


class PostSearchFilterBackend(SearchFilter):
    def get_search_terms(self, request):
        """
        重写这个方法，从request data中获取数据
        """
        params = request.data.get(self.search_param, "")
        params = params.replace("\x00", "")  # strip null characters
        params = params.replace(",", " ")
        return params.split()
