// src/components/Chatbot.js
import React, { useState } from 'react';
import axios from 'axios';
import '../styles/Chatbot.css';

const Chatbot = () => {
    //const api_key = process.env.AI_API_KEY; 
    const [question, setQuestion] = useState("");
    const [messages, setMessages] = useState([]);
    const [isOpen, setIsOpen] = useState(false); // Controls the popup visibility
    
   const generateAnswer = async () => {
        if (!question.trim()) return;
    
        // Add user question to messages
        const userMessage = { text: question, sender: 'user' };
        setMessages((prevMessages) => [...prevMessages, userMessage]);
    
        try {
            const response = await axios({
                url: `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyAeX1PXlREUtKfDUPIQOeUNNkUUqED8ncU`,
                method: "POST",
                data: {
                    "contents": [{
                        "parts": [{
                            "text": `You are an AI assistant specializing in Ayurveda and holistic health. 
                            Provide accurate and concise answers related to Ayurvedic principles, treatments,
                             herbs, doshas, and well-being. You can also answer queries about AYUSH
                              (Ministry of Ayurveda, Yoga, Unani, Siddha, and Homeopathy) and its initiatives in India.
                               If a question is unrelated to health or Ayurveda, respond with: 
                               'I specialize in Ayurveda and holistic health.
                                Please ask a health-related question.( ALso respond to hi or hello)
                            User's question: "${question}"`
                        }]
                    }]
                }
            });
    
            // Extract AI response
            const aiResponse = response.data?.candidates?.[0]?.content?.parts?.[0]?.text || 
                               "Sorry, I couldn't understand the request.";
    
            const aiMessage = { text: aiResponse, sender: 'ai' };
            setMessages((prevMessages) => [...prevMessages, aiMessage]);
    
        } catch (error) {
            console.error('Error fetching AI response:', error);
            setMessages((prevMessages) => [...prevMessages, { text: "Error connecting to AI.", sender: 'ai' }]);
        }
    
        setQuestion(""); // Clear input after sending
    }; 
    

    return (
        <div className="chatbot-wrapper">
        {/* Floating button */}
        {!isOpen && (
            <button className="chatbot-toggle" onClick={() => setIsOpen(true)}>
                💬 Chat with Veda AI
            </button>
        )}

        {/* Chat Window */}
        {isOpen && (
            <div className="chatbot-popup">
                <div className="chatbot-header">
                    <h3>Veda AI</h3>
                    <button className="close-btn" onClick={() => setIsOpen(false)}>✖</button>
                </div>
                <div className="chat-window">
                    {messages.map((msg, index) => (
                        <div key={index} className={`message ${msg.sender}`}>
                            <span>{msg.text}</span>
                        </div>
                    ))}
                </div>
                <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    cols="30"
                    rows="3"
                    placeholder="Ask your question..."

                    className='input-area'
                ></textarea>
                <button className="ask-ai" onClick={generateAnswer}>Ask AI</button>
            </div>
        )}
    </div>
    );
};

export default Chatbot;
