import matplotlib.pyplot as plt


title = '{{title}}'
x_name = '{{x_name}}'
y_name = '{{y_name}}'

# 设置字体为黑体（SimHei）
plt.rcParams['font.sans-serif'] = ['SimHei']
# 解决负号显示异常问题
plt.rcParams['axes.unicode_minus'] = False

# 读取CSV文件数据为DataFrame，你可以根据实际数据文件格式和路径进行修改
# 这里假设文件名为data.csv，且和当前JupyterLab的notebook在同一目录下

# 假设CSV文件中横坐标数据所在列名为'x'，纵坐标数据所在列名为'y'，请按需修改列名
x_data = data_df['X']
y_data = data_df['y']

# 绘制曲线图
# plt.figure(figsize=(10, 6))
plt.scatter(x_data, y_data)

# 添加标题和坐标轴标签
plt.title(title or 'Scatter Chart')
plt.xlabel(x_name or 'X Axis')
plt.ylabel(y_name or 'Y Axis')

