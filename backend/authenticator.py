from jupyterhub.auth import Authenticator


class ConsoleAuthenticator(Authenticator):
    auto_login = True

    # for Hub 0.7, show 'login with...'
    login_service = 'null'

    async def authenticate(self, handler, data):
        """Checks against a global password if it's been set. If not, allow any user/pass combo"""
        return 'pojkcjgohsritflp'

