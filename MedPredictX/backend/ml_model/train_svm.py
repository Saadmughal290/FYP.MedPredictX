import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.svm import SVC
from sklearn.pipeline import Pipeline
import joblib
import os

def train():
    # Load dataset
    current_dir = os.path.dirname(os.path.abspath(__file__))
    data_path = os.path.join(current_dir, 'data.csv')
    df = pd.read_csv(data_path)

    # We will predict both specialty and urgency. Since SVM natively supports multi-class,
    # but predicts a single label per instance, we can train two separate models or just
    # combine them. For simplicity, we'll train two pipelines.

    X = df['symptoms']
    y_specialty = df['specialty']
    y_urgency = df['urgency']

    # Pipeline for Specialty
    specialty_model = Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english')),
        ('svm', SVC(kernel='linear', probability=True))
    ])
    specialty_model.fit(X, y_specialty)

    # Pipeline for Urgency
    urgency_model = Pipeline([
        ('tfidf', TfidfVectorizer(stop_words='english')),
        ('svm', SVC(kernel='linear', probability=True))
    ])
    urgency_model.fit(X, y_urgency)

    # Save models
    models = {
        'specialty': specialty_model,
        'urgency': urgency_model
    }
    
    model_path = os.path.join(current_dir, 'svm_model.joblib')
    joblib.dump(models, model_path)
    print(f"Models trained and saved to {model_path}")

if __name__ == "__main__":
    train()
