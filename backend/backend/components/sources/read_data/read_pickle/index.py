import pickle


file_path = "{{file_path}}"

with open(file_path, 'rb') as f:
    pickle_data = pickle.load(f)
