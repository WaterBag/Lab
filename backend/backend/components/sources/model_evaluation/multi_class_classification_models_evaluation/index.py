from sklearn.metrics import accuracy_score, f1_score, recall_score, precision_score
from sklearn.metrics import confusion_matrix, multilabel_confusion_matrix
import pandas as pd
import numpy as np

# 适配模型服务参数注入功能
module_config = {
    'features': "{{col_xs}}",
    'label': "{{col_y}}"
}
col_xs = "{{col_xs}}"
method = '{{method}}'

# 获得特征列
cols = module_config['features'].split(',')
X = in_data[col_xs].tolist()

output1 = X
pre_data = X
cm = X
# 获得预测列
y_true = in_data[module_config['label']].values
y_pred = in_model.predict(X)
labels = [i for i in set(y_true)]

# 计算多分类的混淆矩阵
mcm = multilabel_confusion_matrix(y_true, y_pred, labels=labels)

if set(y_pred) != set(y_true):
    print('''Warning: y_true中有一些标签，它们不会出现在y_pred中，因此它是定义不清的,
    f1_score无法进行预测，所以会设置为0.0''')

# 输出1:包含每一个分类的accuracy，precision，recall，f1值
total = in_data.shape[0]
accuracy = [(mcm[i, 0, 0] + mcm[i, 1, 1]) / total for i in range(mcm.shape[0])]
accuracy = np.array(accuracy).reshape(-1, 1)
f1 = f1_score(y_true, y_pred, average=None, labels=labels).reshape(-1, 1)
recall = recall_score(y_true, y_pred, average=None, labels=labels).reshape(-1, 1)
precision = precision_score(y_true, y_pred, average=None, labels=labels).reshape(-1, 1)
data = np.concatenate([accuracy, precision, recall, f1], axis=1)
output1 = pd.DataFrame(data,
                       index=labels,
                       columns=['Accuracy Score', 'Precision', 'Recall', 'F1 Score']
                       )

# 输出1:如果选择其他指标，则会在前面基础上增加一行'avg_metric'
if method:
    accuracy = accuracy_score(y_true, y_pred)
    f1 = f1_score(y_true, y_pred, average=method)
    recall = recall_score(y_true, y_pred, average=method)
    precision = precision_score(y_true, y_pred, average=method)
    temp = pd.DataFrame(data=[[accuracy, precision, recall, f1]],
                        index=['avg_metric'],
                        columns=['Accuracy Score', 'Precision', 'Recall', 'F1 Score']
                        )
    output1 = pd.concat([output1, temp], axis=0)

# 输出2:in_2增加模型预测的结果
y_test_pred = pd.DataFrame(y_pred)
y_test_pred.rename(columns={0: 'Y_prediction'}, inplace=True)
pre_data = in_data.reset_index(drop=True)
pre_data = pd.concat([y_test_pred, pre_data], axis=1)

# 输出3:每个分类的预测结果统计
cm = confusion_matrix(y_true, y_pred, labels=labels)
cm = pd.DataFrame(data=cm,
                  index=labels,
                  columns=labels
                  )
cm.index.name = "True"
cm.columns.name = "Prediction"


