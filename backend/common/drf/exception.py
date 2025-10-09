import logging

from rest_framework.response import Response
from rest_framework.views import exception_handler

from common.drf.permissions import NotLoginException

logger = logging.getLogger("app")


def custom_exception_handler(exc, context):
    """
    自定义异常处理器
    :param exc:
    :param context:
    :return:
    """
    response = exception_handler(exc, context)
    if response is None:
        # 处理没有继承APIException的普通异常
        response = Response(str(exc))
        logger.exception(exc)
        if isinstance(exc, NotLoginException):
            response.status_code = 401
        else:
            response.status_code = 500
    return response
