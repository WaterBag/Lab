import json
import os

from django.core.management.base import BaseCommand

from config.settings.base import APPS_DIR


class Command(BaseCommand):
    help = "Migrate Component Templates"

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        """
        :param args:
        :param options:
        :return:
        """
        category_path = os.path.join(APPS_DIR, 'components', 'sources')
        category_dir = os.listdir(category_path)
        questions = []
        for cate in category_dir:
            component_path = os.path.join(APPS_DIR, 'components', 'sources', cate)
            components = os.listdir(component_path)
            for component in components:
                with open(os.path.join(component_path, component, 'config.json'), 'r') as f:
                    config = json.loads(f.read())
                    keys = ['name', 'category', 'genre', 'paramsConfig', 'inputConfig', 'outputConfig']
                    for key in keys:
                        if key not in config.keys():
                            questions.append(f'{component}中不存在{key}')

                    def check_params(config_key):
                        param_keys = ['name', 'label', 'desc']
                        params_config = config.get(config_key, [])

                        if config_key in ['paramsConfig', 'inputConfig']:
                            param_keys += ['required']

                        if config_key in ['paramsConfig']:
                            param_keys += ['type', 'default']

                        for i, params in enumerate(params_config):
                            if params.get('type') == 'opt':
                                if 'options' not in params.keys():
                                    questions.append(
                                        f"{component}的{config_key}(第{i + 1}项)缺少options"
                                    )
                            for key in param_keys:
                                if key not in params.keys():
                                    questions.append(
                                        f"{component}的{config_key}(第{i + 1}项)缺少{key}"
                                    )

                    check_params('paramsConfig')
                    check_params('inputConfig')
                    check_params('outputConfig')

        for question in questions:
            print(question)
        if not questions:
            print('无问题')
