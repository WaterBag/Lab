import json
import os

from django.core.files import File
from django.core.files.images import ImageFile
from django.core.management.base import BaseCommand

from backend.lesson.models import Lesson, Chapter
from config.settings.base import BASE_DIR


class Command(BaseCommand):
    help = "Migrate Component Templates"

    def add_arguments(self, parser):
        pass

    def handle(self, *args, **options):
        lesson, _ = Lesson.objects.update_or_create(
            name='医学统计学',
            # image=ImageFile(os.path.join(BASE_DIR, 'res', 'lesson1.png'))
        )
        with open(os.path.join(BASE_DIR, 'res', 'lesson1.png'), 'rb') as f:
            lesson.image.save('lesson1.png', ImageFile(f))

        def render_content(title, url):
            return f'# {title.split("-")[-1]}\n<iframe width="100%" height="750" frameborder="no" border="0" marginwidth="0" marginheight="0" scrolling="no" allowtransparency="yes" src="{url}"/>'

        chapters = [
            {
                "name": "00-绪论",
                "url": "https://lesson-storage-1303020058.cos.ap-guangzhou.myqcloud.com/%E5%8C%BB%E5%AD%A6%E7%BB%9F%E8%AE%A1%E5%AD%A6/pdf/00-%E7%BB%AA%E8%AE%BA.pdf",
                "description": "医学统计学绪论"
            },
            {
                "name": "01-统计研究",
                "url": "https://lesson-storage-1303020058.cos.ap-guangzhou.myqcloud.com/%E5%8C%BB%E5%AD%A6%E7%BB%9F%E8%AE%A1%E5%AD%A6/pdf/01-%E7%BB%9F%E8%AE%A1%E7%A0%94%E7%A9%B6.pdf",
                'description': "医学统计学-第一节-统计研究"
            },
            {
                "name": "02-数据的获取",
                "url": "https://lesson-storage-1303020058.cos.ap-guangzhou.myqcloud.com/%E5%8C%BB%E5%AD%A6%E7%BB%9F%E8%AE%A1%E5%AD%A6/pdf/02-%E6%95%B0%E6%8D%AE%E7%9A%84%E8%8E%B7%E5%8F%96.pdf",
                'description': "医学统计学绪论-第二节-数据的获取"
            },
            {
                "name": "03-研究结果可信么",
                "url": "https://lesson-storage-1303020058.cos.ap-guangzhou.myqcloud.com/%E5%8C%BB%E5%AD%A6%E7%BB%9F%E8%AE%A1%E5%AD%A6/pdf/03-%E7%A0%94%E7%A9%B6%E7%BB%93%E6%9E%9C%E5%8F%AF%E4%BF%A1%E4%B9%88.pdf",
                "description": "医学统计学绪论-第三节-研究结果可信么"
            },
            {
                "name": "05-描述性统计",
                "url": "https://lesson-storage-1303020058.cos.ap-guangzhou.myqcloud.com/%E5%8C%BB%E5%AD%A6%E7%BB%9F%E8%AE%A1%E5%AD%A6/pdf/05-%E6%8F%8F%E8%BF%B0%E6%80%A7%E7%BB%9F%E8%AE%A1.pdf",
                "description": "医学统计学绪论-第五节-描述性统计"
            },
            {
                "name": "06-区间估计",
                "url": "https://lesson-storage-1303020058.cos.ap-guangzhou.myqcloud.com/%E5%8C%BB%E5%AD%A6%E7%BB%9F%E8%AE%A1%E5%AD%A6/pdf/06-%E5%8C%BA%E9%97%B4%E4%BC%B0%E8%AE%A1.pdf",
                "description": "医学统计学绪论-第六节-区间估计"
            }
        ]
        for chapter in chapters:
            Chapter.objects.update_or_create(
                lesson_id=lesson.id,
                name=chapter.get('name'),
                defaults={
                    'content': render_content(chapter.get('name'), chapter.get('url')),
                    'description': chapter.get('description')
                },
            )
