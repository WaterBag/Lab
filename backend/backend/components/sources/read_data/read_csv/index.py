import pandas as pd

file_path = '{{file_path}}'
encoding = '{{encoding}}'
sep = '{{sep}}'

table = pd.read_csv(file_path, encoding=encoding or 'utf-8', sep=sep or ',')
