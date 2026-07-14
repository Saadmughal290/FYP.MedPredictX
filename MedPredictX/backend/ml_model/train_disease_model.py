import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

def train():
    current_dir = os.path.dirname(os.path.abspath(__file__))
    
    # Path to the Training.csv provided by user
    data_path = os.path.abspath(os.path.join(current_dir, '../../ML/Data/Training.csv'))
    
    if not os.path.exists(data_path):
        print(f"Error: Dataset not found at {data_path}")
        return
        
    df = pd.read_csv(data_path)
    
    # Last column is the prognosis
    # Remove it to get features
    X = df.drop('prognosis', axis=1)
    y = df['prognosis']
    
    # We save the feature names so the inference script knows the exact order
    feature_names = list(X.columns)
    
    # Train a Random Forest model
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)
    
    # Save the model and feature names
    saved_data = {
        'model': model,
        'feature_names': feature_names
    }
    
    model_save_path = os.path.join(current_dir, 'disease_model.joblib')
    joblib.dump(saved_data, model_save_path)
    print(f"Disease model trained and saved to {model_save_path}")

if __name__ == "__main__":
    train()
