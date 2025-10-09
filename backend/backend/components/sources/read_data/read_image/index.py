import os

import pandas as pd

from PIL import Image


file_path = '{{file_path}}'
images = []

if os.path.isdir(file_path):
    for image_path in os.listdir(file_path):
        try:
            im = Image.open(os.path.join(file_path, image_path))
            images.append({
                'path': os.path.join(file_path, image_path),
                'image': im
            })
        except Exception:
            print('非图片路径:', file_path)
elif os.path.isfile(file_path):
    images.append({
        'path': file_path,
        'image': Image.open(file_path)
    })
else:
    raise Exception('文件夹或文件路径不正确')

images = pd.DataFrame(images)
