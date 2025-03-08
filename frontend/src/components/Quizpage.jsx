import axios from "axios";
import React, { useState } from "react";
import "../styles/Quizpage.css"; 
// import MedicineRecommendation from "../components/MedicineRecommendation";


const questiondata = [
  {
    id: 1,
    question: "What is your body structure?",
    options: ["Thin", "Medium", "Heavy Body"],  // Fixed
  },
  {
    id: 2,
    question: "What is your skin type?",
    options: ["Dry", "Oily", "Moist"],
  },
  {
    id: 3,
    question: "How would you describe your digestion?",
    options: ["Irregular", "Strong", "Slow Digestion"],  // Fixed
  },
  {
    id: 4,
    question: "How is your sleep quality?",
    options: ["Light", "Normal", "Heavy Sleep"],  // Fixed
  },
  {
    id: 5,
    question: "How stable are your energy levels?",
    options: ["Fluctuating", "Moderate Energy", "Steady"],  // Fixed
  },
  {
    id: 6,
    question: "What is your metabolism rate?",
    options: ["Fast", "Moderate Metabolism", "Slow Metabolism"],  // Fixed
  },
  {
    id: 7,
    question: "Which mood tendency best describes you?",
    options: ["Anxious", "Irritable", "Calm"],
  },
  {
    id: 8,
    question: "What is your preferred taste profile?",
    options: ["Sweet", "Spicy", "Salty"],
  }
];

// Map option strings to numeric values
const optionMapping = {
  "Thin": 0,
  "Medium": 1, 
  "Heavy Body": 2,
  
  "Dry": 0, 
  "Oily": 1, 
  "Moist": 2,
  
  "Irregular": 0, 
  "Strong": 1, 
  "Slow Digestion": 2,
    
  "Light": 0, 
  "Normal": 1, 
  "Heavy Sleep": 2,
    
  "Fluctuating": 0, 
  "Moderate Energy": 1, 
  "Steady": 2,
    
  "Fast": 0, 
  "Moderate Metabolism": 1, 
  "Slow Metabolism": 2, 
   
  "Anxious": 0, 
  "Irritable": 1, 
  "Calm": 2,  
  
  "Sweet": 0, 
  "Spicy": 1, 
  "Salty": 2  
};

const Questions = () => {
  const [answers, setAnswers] = useState({});
  const [dosha,setdosha] = useState("")


  const handleOption = (questionId, selectedOption) => {
    const numericValue = optionMapping[selectedOption]; 
    setAnswers((prev) => ({ ...prev, [questionId]: numericValue }));
  };

  const handleSubmit = async () => {
    const answerArray = Object.values(answers); 
    if (answerArray.length !== 8) {
      alert("Please answer all questions.");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/dosha/detect",
        { answers: answerArray },
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Response:", response.data);
      alert("Answer submitted successfully");
      setdosha(response.data)
    } catch (error) {
      console.error("Error submitting answer", error);
      alert("Error submitting the answers");
    }
  };

  return (
    <>
    <h2 className="quiz-title">Find Your Dosha</h2>
    <div className="quiz-container">
      {/* <h2 className="quiz-title">Find Your Dosha</h2> */}
      {questiondata.map((q) => (
        <div className="question-container" key={q.id}>
          <h4 className="question-text">{q.question}</h4>
          {q.options.map((option) => (
            <div className="option-container" key={option}>
              <input
                type="radio"
                id={`question-${q.id}-option-${option}`}
                name={`question-${q.id}`}
                value={option}
                checked={answers[q.id] === optionMapping[option]}
                onChange={() => handleOption(q.id, option)}
                className="radio-input"
              />
              <label htmlFor={`question-${q.id}-option-${option}`} className="radio-label">
                {option}
              </label>
            </div>
          ))}
        </div>
      ))}
      <button onClick={handleSubmit} className="submit-button">Submit</button>
      {/* <MedicineRecommendation dosha = {dosha}/> */}

    </div>
    </>
  );
};

export default Questions;

