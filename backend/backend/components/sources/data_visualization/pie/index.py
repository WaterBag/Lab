import matplotlib.pyplot as plt

title = '{{title}}'

# 设置字体为黑体（SimHei）
plt.rcParams['font.sans-serif'] = ['SimHei']
# 解决负号显示异常问题
plt.rcParams['axes.unicode_minus'] = False

x_data = data_df['X']
y_data = data_df['y']

plt.pie(y_data, labels=x_data)
plt.title(title or 'Pie Chart')

