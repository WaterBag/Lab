import numpy as np


image_col = '{{image_col}}'
mode = '{{mode}}'


def convert(row):
    row[image_col] = np.asarray(row.get(image_col))
    return row


images = in_images.apply(convert, axis=1)
