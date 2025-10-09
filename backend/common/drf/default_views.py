import json

from django.http import HttpResponse


def page_not_found(request, exception, **kwargs):
    data = {
        "result": False,
        "data": "404",
        "code": 404,
        "message": "404",
        "error": "404",
    }
    return HttpResponse(json.dumps(data), content_type="application/json")
