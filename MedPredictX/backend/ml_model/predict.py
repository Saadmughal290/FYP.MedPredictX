import os
import joblib

def predict_specialty(symptoms):
    """
    Predicts the specialty and urgency based on the symptoms string.
    Returns a dictionary matching the expected structure or None if model doesn't exist.
    """
    current_dir = os.path.dirname(os.path.abspath(__file__))
    model_path = os.path.join(current_dir, 'svm_model.joblib')
    
    if not os.path.exists(model_path):
        return None
        
    try:
        models = joblib.load(model_path)
        specialty_model = models.get('specialty')
        urgency_model = models.get('urgency')
        
        if not specialty_model or not urgency_model:
            return None
            
        # The model expects an iterable of strings
        symptoms_list = [symptoms]
        
        predicted_specialty = specialty_model.predict(symptoms_list)[0]
        predicted_urgency = urgency_model.predict(symptoms_list)[0]
        
        return {
            "recommended_specialty": predicted_specialty,
            "urgency": predicted_urgency,
            "reasons": ["Our machine learning model identified these symptoms as indicative of this specialty."],
            "immediate_actions": ["Please schedule an appointment with the recommended specialist.", "Follow the urgency guidelines provided."],
            "what_to_expect": "The specialist will conduct a further evaluation based on your symptoms.",
            "disclaimer": "This is an AI recommendation from a local ML model and not a substitute for professional medical advice."
        }
        
    except Exception as e:
        print(f"Error predicting with SVM: {str(e)}")
        return None
