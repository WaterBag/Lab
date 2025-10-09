image_col = '{{image_col}}'
mode = '{{mode}}'


def convert(row):
    row[image_col] = row.get(image_col).convert(mode)
    return row


images = in_images.apply(convert, axis=1)
