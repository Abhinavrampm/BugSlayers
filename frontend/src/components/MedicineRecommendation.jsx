import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import '../styles/MedicineRecommendation.css'

const symptomsList = [
    "abdominal_bloating", "abdominal_pain", "acidity", "belching", "blood_in_mucus",
    "blood_in_stool", "blurred_and_distorted_vision", "burning_ache", "cramping",
    "dehydration", "depression", "excessive_hunger", "fatigue", "fever",
    "fullness_feeling", "gnawing", "headache", "heartburn", "hiccups",
    "indigestion", "irritability", "loss_of_appetite", "movement_stiffness",
    "muscle_weakness", "nausea", "painful_walking", "stiff_neck", "swelling_joints",
    "upper_abdomain_pain", "visual_disturbances", "vomiting"
];

const MedicineRecommendation = (props) => {
    const [selectedSymptoms, setSelectedSymptoms] = useState({});
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const dropdownRef = useRef(null);

    // Toggle symptom selection
    const handleSymptomChange = (symptom) => {
        setSelectedSymptoms(prev => ({
            ...prev,
            [symptom]: prev[symptom] === 1 ? 0 : 1
        }));
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Prepare and send data to backend
    const predictDisease = async () => {
        const symptomsArray = Object.keys(selectedSymptoms).filter(symptom => selectedSymptoms[symptom] === 1);

        if (symptomsArray.length === 0) {
            alert("Please select at least one symptom.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5001/api/predict_disease", { symptoms: symptomsArray });
            setPrediction(response.data.predicted_disease);
        } catch (error) {
            console.error("Error predicting disease:", error);
            alert("Error making prediction.");
        }
    };

    return (
        <div className="main-div">
            <h1 className="main-title">Your dominant Dosha is {props.data}</h1>
            <div className="form1-container">
                <p className="label-select">Enter your details</p>
                <form className="form1" >
                    <div>
                        <label > Enter your name </label>
                        <input type="text" required  className="input-area"/>
                    </div>
                    <div>
                        <label > Enter your age </label>
                        <input type="number" min="1" max="150" required className="input-area"/>
                    </div>
                    <div>
                        <label > Select your gender: </label>
                        <input type="radio" id="male" name="gender" value="Male" />
                        <label for="html">Male</label> &nbsp;
                        <input type="radio" id="female" name="gender" value="Female" />
                        <label for="css">Female</label> &nbsp;
                        <input type="radio" id="others" name="gender" value="Others" />
                        <label for="javascript">Others</label>
                    </div>

                    <div className="dropdown-wapper">
                        {/* Dropdown Button */}
                        <div className="dropdown-container" ref={dropdownRef}>
                            <button className="dropdown-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
                                {Object.keys(selectedSymptoms).filter(symptom => selectedSymptoms[symptom] === 1).length > 0
                                    ? Object.keys(selectedSymptoms).filter(symptom => selectedSymptoms[symptom] === 1).join(", ")
                                    : "Select Symptoms"} ▼
                            </button>

                            {/* Dropdown List */}
                            {dropdownOpen && (
                                <div className="dropdown-menu">
                                    {symptomsList.map(symptom => (
                                        <label key={symptom} className="dropdown-item">
                                            <input
                                                type="checkbox"
                                                checked={selectedSymptoms[symptom] === 1}
                                                onChange={() => handleSymptomChange(symptom)}
                                            />
                                            {symptom.replace(/_/g, " ")}
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <br />
                        <button onClick={predictDisease} className="predict-button">Predict Disease</button>
                    </div>
                </form>
            </div>
            <p className="label-select">VedaBot thinks that you are suffering from {props.data}</p>
            <div className="severity-div">
                <div>
                    
                </div>
                <label > Select your severity level: </label> &nbsp; 
                <div>
                    <input type="radio" id="low" name="severity" value="Low" />
                    <label for="low">Low</label> &nbsp;
                
                    <input type="radio" id="medium" name="seveity" value="Medium" />
                    <label for="medium">Medium</label> &nbsp;
                
                    <input type="radio" id="high" name="severity" value="High" />
                    <label for="high">High</label>
                </div>
                
            </div> <br />
            <button className="recommend-button">Recommend medications</button> <br /><br />






            {/* Prediction Result */}
            {prediction && (
                <div>
                    <h3>Predicted Disease: {prediction}</h3>
                </div>
            )}
        </div>
    );
};

export default MedicineRecommendation;
