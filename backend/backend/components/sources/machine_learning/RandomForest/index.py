from sklearn.ensemble import RandomForestClassifier, RandomForestRegressor

col_x = '{{col_x}}'
col_y = '{{col_y}}'
genre = '{{genre}}'

module_config = {
    'n_estimators': {{n_estimators}},
    'max_features': {{max_features}},
    'max_depth': {{max_depth}},
    'min_samples_leaf': {{min_samples_leaf}},
    'max_leaf_nodes': {{max_leaf_nodes}},
    'oob_score': {{oob_score}},
    'random_state': {{random_state}}
}

X = in_1[col_x].tolist()
y = in_1[col_y].tolist()

if genre == 'Classifier':
    rf = RandomForestClassifier(
        n_estimators=module_config['n_estimators'],
        max_depth=module_config['max_depth'],
        min_samples_leaf=module_config['min_samples_leaf'],
        max_features=module_config['max_features'],
        max_leaf_nodes=module_config['max_leaf_nodes'],
        oob_score=module_config['oob_score'],
        random_state=module_config['random_state']
    )
else:
    rf = RandomForestRegressor(
        n_estimators=module_config['n_estimators'],
        max_depth=module_config['max_depth'],
        min_samples_leaf=module_config['min_samples_leaf'],
        max_features=module_config['max_features'],
        max_leaf_nodes=module_config['max_leaf_nodes'],
        oob_score=module_config['oob_score'],
        random_state=module_config['random_state']
    )

rf.fit(X, y)
