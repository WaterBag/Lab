from sklearn import neighbors

col_x = '{{col_x}}'
col_y = '{{col_y}}'
k = {{k}}
rule = '{{rule}}'
distance = {{distance}}

X = in_1[col_x]

#获得预测列
y = in_1[col_y]

#模型初始化和训练
knn = neighbors.KNeighborsClassifier(
    n_neighbors=k,
    weights=rule,
    p=float(distance)
)

knn.fit(X.tolist(), y.tolist())
print("恭喜您，模型训练成功✌ 请使用「评估你的模型」中的组件进行下一步。️")
