import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import '../styles/MedicineRecommendation.css';

const symptomsList = [
    "abdominal_bloating", "abdominal_pain", "acidity", "belching", "blood_in_mucus",
    "blood_in_stool", "blurred_and_distorted_vision", "burning_ache", "cramping",
    "dehydration", "depression", "excessive_hunger", "fatigue", "fever",
    "fullness_feeling", "gnawing", "headache", "heartburn", "hiccups",
    "indigestion", "irritability", "loss_of_appetite", "movement_stiffness",
    "muscle_weakness", "nausea", "painful_walking", "stiff_neck", "swelling_joints",
    "upper_abdomain_pain", "visual_disturbances", "vomiting"
];

const MedicineRecommendation = () => {
    const [selectedSymptoms, setSelectedSymptoms] = useState({});
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [predictedDisease, setPredictedDisease] = useState(null); // Store disease
    const [recommendedMedicine, setRecommendedMedicine] = useState(null);
    const dropdownRef = useRef(null);
    const [allergy, setAllergy] = useState(""); // New state for allergy input
    const [alternativeMedicine, setAlternativeMedicine] = useState("");
    const [dosha, setDosha] = useState("Unknown");
    const [foodRecommendation, setFoodRecommendation] = useState('');
    const [userDetails, setUserDetails] = useState({
        name: "",
        age: "",
        gender: "",
        severity: ""
    });

    const getFoodRecommendations = async () => {
        try {
            const response = await axios({
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCXdhycYjvVgQTzcbNy6s-rOCDWxC0t_Fg`,
                method: "POST",
                data: {
                    "contents": [{
                        "parts": [{
                            "text": `Provide a concise Ayurvedic diet recommendation for ${dosha} Dosha imbalance.
                            - Limit response to only 5 key points.
                            - Include 3 recommended foods and 2 foods to avoid.
                            - Format response in short, simple lines.
                            - Example format:
                              1. Eat X, Y, Z (benefits)
                              2. Avoid A, B (why)
                              3. Simple meal example: Breakfast - ____, Lunch - ____, Dinner - ____`
                        }]
                    }]
                }
            });

            console.log("Food Recommendation Response:", response.data);

            const foodResponse = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

            // Split response into lines for cleaner display
            setFoodRecommendation(foodResponse.split("\n"));

        } catch (error) {
            console.error("Error fetching food recommendation:", error);
            alert("Error getting diet suggestions.");
        }
    };


    useEffect(() => {
        const storedDosha = localStorage.getItem("dosha");
        if (storedDosha) {
            setDosha(storedDosha);
        }
    }, []);




    // Handle Input Changes
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUserDetails(prev => ({ ...prev, [name]: value }));
    };

    // Toggle symptom selection
    const handleSymptomChange = (symptom) => {
        setSelectedSymptoms(prev => ({
            ...prev,
            [symptom]: prev[symptom] === 1 ? 0 : 1
        }));
    };

    // Handle Allergy Input Change
    const handleAllergyChange = (e) => {
        setAllergy(e.target.value);
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

    // Predict Disease (Store result in state)
    const predictDisease = async () => {
        const symptomsArray = Object.keys(selectedSymptoms).filter(symptom => selectedSymptoms[symptom] === 1);

        if (symptomsArray.length === 0) {
            alert("Please select at least one symptom.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5001/api/predict_disease", { symptoms: symptomsArray });
            const formattedDisease = response.data.predicted_disease.toLowerCase();
            console.log("Disease in lower case: ", formattedDisease);
            setPredictedDisease(formattedDisease);
        } catch (error) {
            console.error("Error predicting disease:", error);
            alert("Error making prediction.");
        }
    };

    // Get Recommended Medicine (Only after severity is selected)
    const recommendMedicine = async () => {
        if (!userDetails.age || !userDetails.gender || !userDetails.severity || !predictedDisease) {
            alert("Please fill in all fields before getting recommendations.");
            return;
        }

        try {
            const response = await axios.post("http://localhost:5002/api/recommend-drug", {
                age: userDetails.age,
                gender: userDetails.gender,
                severity: userDetails.severity,
                Dosha_Type: dosha,
                disease: predictedDisease
            });

            console.log("Medicine recommended", response.data);

            setRecommendedMedicine(response.data.predicted_drug);

            // ✅ After getting recommended medicine, check with Gemini API
            checkAlternativeMedicine(response.data.predicted_drug);

        } catch (error) {
            console.error("Error getting recommended medicine:", error);
            alert("Error fetching medicine recommendation.");
        }
    };

    const checkAlternativeMedicine = async (medicine) => {
        if (!allergy) {
            setAlternativeMedicine(null); // If no allergy, no need to check
            return;
        }

        try {
            const response = await axios({
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCXdhycYjvVgQTzcbNy6s-rOCDWxC0t_Fg`,
                method: "POST",
                data: {
                    "contents": [{
                        "parts": [{
                            "text": `You are an AI assistant specializing in Ayurveda and holistic health.
                        A patient has been prescribed "${medicine}", but they are allergic to "${allergy}". 
                        If the prescribed medicine could trigger an allergic reaction, suggest an alternative 
                        Ayurvedic medicine that is safe. Otherwise, respond with: "No alternative needed, the prescribed medicine is safe."`
                        }]
                    }]
                }
            });

            console.log("Gemini API Response:", response.data);

            // ✅ Fix: Check if response structure is valid before accessing properties
            const geminiResponse = response?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

            if (geminiResponse) {
                setAlternativeMedicine(geminiResponse);
            } else {
                console.error("Unexpected response structure:", response.data);
                setAlternativeMedicine("Unable to get alternative medicine.");
            }
        } catch (error) {
            console.error("Error fetching alternative medicine from Gemini:", error);
            alert("Error getting alternative medicine.");
        }
    };


    return (
        <div className="main-div">
            <h1 className="main-title">Your dominant Dosha is: {dosha}</h1>
            <button type="button" onClick={getFoodRecommendations} className="food-button">
                Get Food Recommendations
            </button>

            {foodRecommendation.length > 0 && (
                <div className="recommendation-box">
                    <h3 className="recommendation-title">Balanced Ayurvedic Diet</h3>
                    <ul className="recommendation-list">
                        {foodRecommendation.map((line, index) => (
                            <p key={index}>{line}</p>
                        ))}
                    </ul>
                </div>
            )}


            <div className="form1-container">
                <p className="label-select">Let our AI Analyze You</p>
                <form className="form1">
                    <div>
                        <label> Enter your name: </label>
                        <input type="text" name="name" required className="input-area" onChange={handleInputChange} />
                    </div>
                    <div className="age-wrapper">
                        <label> Enter your age: </label>
                        <input type="number" name="age" min="1" max="150" required className="input-area" onChange={handleInputChange} />
                    </div>
                    <div>
                        <label> Select your gender: </label>
                        <input type="radio" id="male" name="gender" value="male" onChange={handleInputChange} />
                        <label htmlFor="male">male</label> &nbsp;
                        <input type="radio" id="female" name="gender" value="female" onChange={handleInputChange} />
                        <label htmlFor="female">female</label> &nbsp;
                    </div>

                    <div>
                        <label> Do you have any allergies? </label>
                        <input type="text" className="input-area" value={allergy} onChange={handleAllergyChange} placeholder="Enter allergy (optional)" />
                    </div>

                    <div className="dropdown-wrapper">
                        <div className="dropdown-container" ref={dropdownRef}>
                            <button type="button" className="dropdown-button" onClick={() => setDropdownOpen(!dropdownOpen)}>
                                {Object.keys(selectedSymptoms).filter(symptom => selectedSymptoms[symptom] === 1).join(", ") || "Select Symptoms"} ▼
                            </button>

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

                        <button type="button" onClick={predictDisease} className="predict-button">Predict Disease</button>
                    </div>
                </form>
            </div>

            {predictedDisease && (
                <>
                    <p className="label-select">VedaBot thinks that you are suffering from:</p>
                    <h1>{predictedDisease.toUpperCase()}</h1>

                    <div className="severity-div">
                        <label className="severity-header">Select your severity level: </label> &nbsp;
                        <div className="severity-wrapper">
                            <input type="radio" id="low" name="severity" value="LOW" onChange={handleInputChange} />
                            <label htmlFor="low">LOW</label> &nbsp;
                            <input type="radio" id="medium" name="severity" value="NORMAL" onChange={handleInputChange} />
                            <label htmlFor="NORMAL">NORMAL</label> &nbsp;
                            <input type="radio" id="high" name="severity" value="HIGH" onChange={handleInputChange} />
                            <label htmlFor="high">HIGH</label>
                        </div>
                    </div>

                    {userDetails.severity && (
                        <button type="button" onClick={recommendMedicine} className="recommend-button">Recommend Medications</button>
                    )}
                </>
            )}

            {recommendedMedicine && (
                <div>
                    <h3>Recommended Medicine: {recommendedMedicine.toUpperCase()}</h3>
                    {alternativeMedicine ? (
                        <h3>Allergy Warning (if any): {alternativeMedicine}</h3>
                    ) : (
                        <p>No alternative needed.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default MedicineRecommendation;
