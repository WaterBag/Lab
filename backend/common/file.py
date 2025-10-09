import os

from config.settings.base import BASE_DIR


class FileHandler:

    def __init__(self, app='common'):
        self.app = app
        self.parent_path = os.path.join(BASE_DIR, 'datafiles')
        self.app_path = os.path.join(self.parent_path, app)

    def save(self, file):
        pass
