from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd

# Load trained model and encoders
MODEL_PATH = "Ayurvedic_Drug_Recommendation.sav"  # Change to "Drug_Recommendation_XGB_Model.sav" if using XGBoost
ENCODER_PATH = "label_encoders.pkl"

model = joblib.load(MODEL_PATH)
label_encoders = joblib.load(ENCODER_PATH)

# Create Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for frontend access

# List of feature names (same as training features)
FEATURES = ["age", "gender", "severity", "Dosha_Type", "disease"]

@app.route("/api/recommend-drug", methods=["POST"])
def predict():
    try:
        # Get JSON request
        data = request.json
        print("Received data:", data)

        # Validate input
        for feature in FEATURES:
            if feature not in data:
                return jsonify({"error": f"Missing required field: {feature}"}), 400

        # Convert categorical values using saved LabelEncoders
        input_data = []
        for feature in FEATURES:
            if feature in label_encoders:  # Encode categorical features
                input_data.append(label_encoders[feature].transform([data[feature]])[0])
            else:
                input_data.append(data[feature])  # Keep numerical values as is

        # Convert input into DataFrame format
        input_df = pd.DataFrame([input_data], columns=FEATURES)

        # Make prediction
        predicted_drug = model.predict(input_df)[0]

        # Decode drug label back to its original name
        drug_name = label_encoders["drug"].inverse_transform([predicted_drug])[0]

        return jsonify({"predicted_drug": drug_name})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Run the Flask app
if __name__ == "__main__":
    app.run(port=5002, debug=True)
