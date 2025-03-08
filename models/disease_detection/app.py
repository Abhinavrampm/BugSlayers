from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

# Load trained Decision Tree model
MODEL_PATH = "DecisionTree-Model.sav"
clf = joblib.load(MODEL_PATH)

# List of all possible symptoms (must match training data features)
SYMPTOMS = ['acidity', 'indigestion', 'headache', 'blurred_and_distorted_vision',
            'excessive_hunger', 'muscle_weakness', 'stiff_neck', 'swelling_joints',
            'movement_stiffness', 'depression', 'irritability', 'visual_disturbances',
            'painful_walking', 'abdominal_pain', 'nausea', 'vomiting', 'blood_in_mucus',
            'fatigue', 'fever', 'dehydration', 'loss_of_appetite', 'cramping',
            'blood_in_stool', 'gnawing', 'upper_abdomain_pain', 'fullness_feeling',
            'hiccups', 'abdominal_bloating', 'heartburn', 'belching', 'burning_ache']

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

@app.route("/api/predict_disease", methods=["POST"])
def predict_disease():
    try:
        # Get JSON request
        data = request.json
        user_symptoms = data.get("symptoms", [])

        # Validate input
        if not isinstance(user_symptoms, list) or len(user_symptoms) == 0:
            return jsonify({"error": "Invalid input. Provide a list of symptoms."}), 400

        # Initialize feature dictionary with all symptoms set to 0
        symptom_dict = {symptom: 0 for symptom in SYMPTOMS}

        # Set reported symptoms to 1
        for symptom in user_symptoms:
            if symptom in symptom_dict:
                symptom_dict[symptom] = 1

        # Convert input into DataFrame format
        df_test = pd.DataFrame([symptom_dict])

        # Predict disease
        predicted_disease = clf.predict(df_test)[0]

        return jsonify({"predicted_disease": predicted_disease})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == "__main__":
    app.run(port=5001, debug=True)
