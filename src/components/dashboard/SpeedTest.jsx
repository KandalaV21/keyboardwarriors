import React from 'react';
import TypingTest from '../typing/TypingTest';
import './SpeedTest.css';

const SpeedTest = () => {
  return (
    <div className="speed-test-page">
      <div className="speed-test-header">
        <h1>Typing Speed Test</h1>
        <p>Test your typing speed and accuracy in 60 seconds</p>
      </div>
      <TypingTest />
    </div>
  );
};

export default SpeedTest;
