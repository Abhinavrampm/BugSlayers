import React, { useState } from "react";
import "../styles/Home.css";
import doshaImage from "../assets/pic_1.jpg"; // Importing the image
const Home = () => {

    const navigate = (path) => {
        window.location.href = path;
    }

  const [hoveredDosha, setHoveredDosha] = useState(null);
  const doshaDetails = {
    vata: {
      name: "Vata",
      description: "Slim and light body type, energetic and creative, but prone to dryness and restlessness. Needs warmth, hydration, and a balanced routine."
    },
    pitta: {
      name: "Pitta",
      description: "Medium build, strong digestion, ambitious and passionate, but can overheat easily. Needs cooling foods and stress management to maintain balance."
    },
    kapha: {
      name: "Kapha",
      description: "Solid and strong body type, calm and compassionate, but prone to sluggishness. Needs regular exercise and light, warm foods to stay active."
    }
  };
  return (
    <div className="home-wrapper">
      <div className="home-container">
        <div className="body-content">
          {/* Main Heading */}
          <h2 className="highlight">Discover Your Dosha – The Key to Your Health & Well-being!</h2>
          {/* Dosha Boxes */}
          <div className="dosha-container">
            {Object.keys(doshaDetails).map((dosha) => (
              <div
                key={dosha}
                className={`dosha-box ${dosha}`}
                onMouseEnter={() => setHoveredDosha(dosha)}
                onMouseLeave={() => setHoveredDosha(null)}
              >
                <p className="dosha-name">{doshaDetails[dosha].name}</p>
                {hoveredDosha === dosha && (
                  <p className="hover-text">{doshaDetails[dosha].description}</p>
                )}
              </div>
            ))}
          </div>
          {/* Image */}
          <div className="image-container">
            <img src={doshaImage} alt="Dosha Representation" className="dosha-image" />
          </div>
          {/* CTA Section */}
          <div className="cta-container">
            <p className="cta-text">Ready to unlock your personalized wellness journey?</p>
            <button className="quiz-button" onClick={() => navigate('/quiz-page')}>Start Quiz</button>
          </div>
          {/* About the Project Section */}
          <div id="about" className="about-section">
            <h2>About the Project</h2>
            <p>
              Veda Bot is designed to help individuals discover their unique dosha type and understand how it influences their well-being.
              By answering a simple quiz, users receive personalized insights into their body type and lifestyle recommendations based on Ayurveda.
              The project combines modern technology with ancient wisdom to guide users toward holistic health and balance.
            </p>
          </div>
          {/* About the Team Section */}
          <div className="team-section">
            <h2>About the Team</h2>
            <p>
              We are a passionate team of four developers dedicated to creating meaningful digital experiences.
              Our mission is to bridge the gap between technology and well-being by providing an interactive and informative platform.
              With diverse expertise in web development, UI/UX, and AI integration, we aim to make Ayurveda more accessible to everyone.
            </p>
          </div>
        </div>
      </div> {/* End of home-container */}
      {/* Footer outside of home-container */}
      <footer id="contact" className="footer">
        <div className="footer-content">
          <h3>Contact Us</h3>
          <p>Email: abhinavrampm@gmail.com</p>
          <p>Phone: +91 8943482195</p>
          <p>Address: 123 Wellness St, AyurCity</p>
        </div>
      </footer>
    </div>
  );
};
export default Home;