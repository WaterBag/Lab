import json
import logging

# from allauth.account.internal.stagekit import unstash_login
from django.http import JsonResponse
from django.utils.deprecation import MiddlewareMixin
from django.views.decorators.csrf import csrf_exempt

debug = logging.getLogger("root")


class ExceptionMiddleware(MiddlewareMixin):

    def process_exception(self, request, exception):
        if not request.path.startswith('/api') or request.path.startswith('/api/accounts'):
            # 统一处理�?drf的异�?
            return JsonResponse({
                'result': False,
                'code': '500',
                'data': str(exception),
                'errors': [{'message': str(exception)}],
            })


class AllRequestsMiddleware(MiddlewareMixin):

    def process_view(self, request, view_func, view_args, view_kwargs):
        # 统一处理 django all auth headless�?csrf豁免
        if request.path.startswith('/api/accounts/'):
            # return csrf_exempt(view_func)(request, *view_args, **view_kwargs)
            # 使用csrf_exempt装饰?
            try:
                return csrf_exempt(view_func)(request, *view_args, **view_kwargs)
            except Exception as e:
                e_str = str(e)
                resp = JsonResponse({
                    'result': False,
                    'code': '500',
                    'data': e_str,
                    'message': e_str,
                    'error': e_str
                })
                resp.status_code = 500
                return resp
        return None

    def process_response(self, request, response: JsonResponse):
        if request.path.startswith('/api/accounts/') and isinstance(response, JsonResponse):
            # 处理 django all auth headless�?api 包裹
            content = json.loads(response.content.decode())
            message = None
            status_code = response.status_code
            if status_code == 401:
                for item in content.get('data').get('flows', []):
                    if item.get('id') == 'verify_email':
                        email = item.get('email')
                        if not email:
                            try:
                                body = json.loads(getattr(request, 'body', b'') or b'{}')
                                email = body.get('email')
                            except Exception:
                                email = None
                        if email:
                            item['email'] = email
                        message = '用户邮箱未验证?'
                if request.path == '/api/accounts/browser/v1/auth/email/verify':
                    status_code = 200
                    content = {'data': {'status': 'succeed'}}
            results = JsonResponse({
                'result': status_code == 200,
                'code': status_code,
                'data': content.get('data'),
                'message': message or ';'.join(map(lambda item: item.get('message'), content.get('errors') or [])),
                'error': content.get('errors') or ''
            })
            results.cookies = response.cookies
            return results
        return response
