import React from 'react';
import './styles/welcome.css';

const Welcome: React.FC = () => {
  return (
    <div className="welcome-container">
      <div className="welcome-card">
        <h1 className="welcome-title">Welcome to the Application!</h1>
        <p className="welcome-message">
          We're glad to have you here. Explore and enjoy your experience!
        </p>
        <button className="welcome-button" onClick={() => alert('Let’s Get Started!')}>
          Get Started
        </button>
      </div>
    </div>
  );
};

export default Welcome;