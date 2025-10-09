import requests

from config.settings.base import JUPYTERHUB_API_TOKEN, JUPYTERHUB_HOST, JUPYTERHUB_COMMON_USER


class JupyterHandler:
    API_URL = f'{JUPYTERHUB_HOST}hub/api'

    @classmethod
    def request(cls, *args, **kwargs):
        headers = kwargs.pop('headers', {})
        url = kwargs.pop('url', '')
        url = f'{cls.API_URL}{url}'
        headers.update({
            'Authorization': f'token {JUPYTERHUB_API_TOKEN}',
        })
        return requests.request(*args, **kwargs, url=url, headers=headers)

    @classmethod
    def list_users(cls):
        """
        拉取用户列表
        :return:
        """
        return cls.request(url='/users', method='GET').json()

    @classmethod
    def create_user(cls, username):
        """
        创建用户
        :return:
        """
        return cls.request(url=f"/users/{username}", method="POST").json()

    @classmethod
    def create_named_server(cls, project):
        """
        创建这个用户的named_server
        :param project:
        :return:
        """
        return cls.request(method='POST', url=f'/users/{JUPYTERHUB_COMMON_USER}/servers/{project}').content.decode()

    @classmethod
    def start_named_server(cls, project):
        """
        启动named_server
        :param project:
        :return:
        """
        return cls.request(method='POST', url=f'/users/{JUPYTERHUB_COMMON_USER}/servers/{project}').content.decode()

    @classmethod
    def stop_named_server(cls, project, remove=False):
        return cls.request(
            method='DELETE', url=f'/users/{JUPYTERHUB_COMMON_USER}/servers/{project}', json={'remove': remove}
        ).content.decode()


if __name__ == '__main__':
    users = JupyterHandler.stop_named_server('project_4', True)
    print(users)
    # for user in users:
    #     print(user)

