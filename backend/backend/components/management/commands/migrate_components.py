import json
import os

from django.core.management.base import BaseCommand

from backend.components.models import ComponentCategory, Component
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
        categories = [
            {"name": "数据读取", "key": "read_data"},
            {"name": "数据描述", "key": "describe_data"},
            {"name": "数据预处理", "key": "data_preprocessing"},
            {"name": "模型评估", "key": "model_evaluation"},
            {"name": "机器学习", "key": "machine_learning"},
            {"name": "统计分析", "key": "statistic_analysis"},
            {"name": "文本分析", "key": "text_analysis"},
            {"name": "数据可视化", "key": "data_visualization"},
            {"name": "特征工程", "key": "feature_engineering"},
            {"name": "数据写入", "key": "write_data"},
            {"name": "其他", "key": "other"},
            {"name": "自定义脚本", "key": "custom"}
        ]
        for category in categories:
            ComponentCategory.objects.update_or_create(
                name=category.get('name'),
                key=category.get('key'),
                defaults={
                    'created_by': '系统'
                }
            )

        category_path = os.path.join(APPS_DIR, 'components', 'sources')
        category_dir = os.listdir(category_path)
        for cate in category_dir:
            component_path = os.path.join(APPS_DIR, 'components', 'sources', cate)
            components = os.listdir(component_path)
            for component in components:
                with open(os.path.join(component_path, component, 'config.json'), 'r') as f:
                    config = json.loads(f.read())
                    name = config.get('name')
                    category = config.get('category')
                    genre = config.get('genre')
                    del config['name']
                    del config['category']
                    del config['genre']
                    with open(os.path.join(component_path, component, 'index.py'), 'r') as source:
                        config['source'] = source.read()
                    config['created_by'] = '系统'
                    print(name, category, genre)
                    Component.objects.update_or_create(
                        name=name,
                        category=category,
                        genre=genre,
                        defaults=config
                    )

