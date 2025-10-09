
cols = '{{cols}}'
sort_mode = '{{sort_mode}}'

cols = cols.split(',')
out_data = in_data.sort_values(
    by=cols,
    ascending=sort_mode == 'asc'
)

out_data = out_data.reset_index(drop=True)
