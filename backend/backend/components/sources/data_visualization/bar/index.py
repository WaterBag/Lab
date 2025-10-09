import matplotlib.pyplot as plt


direction = '{{direction}}'
title = '{{title}}'
x_name = '{{x_name}}'
y_name = '{{y_name}}'

# 设置字体为黑体（SimHei）
plt.rcParams['font.sans-serif'] = ['SimHei']
# 解决负号显示异常问题
plt.rcParams['axes.unicode_minus'] = False

x_data = data_df['X']
y_data = data_df['y']

if direction == 'vertical':
    plt.bar(x_data, y_data)
else:
    plt.barh(x_data, y_data)

plt.title(title or 'Bar Chart')
plt.xlabel(x_name or 'X Axis')
plt.ylabel(y_name or 'Y Axis')
