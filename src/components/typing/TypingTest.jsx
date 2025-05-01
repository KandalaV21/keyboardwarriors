import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../../lib/supabase';
import './TypingTest.css';

const TIMER_DURATION = 60; // 60 seconds

const generateText = () => {
  const texts = [
    "Artificial Intelligence mimics human cognition through machine learning. It powers chatbots, diagnostics, and automation. Ethical concerns like bias exist, but AI's potential in healthcare, finance, and research drives rapid adoption. GPT-4 and DeepMind showcase its evolving capabilities toward general intelligence.",
    "Blockchain enables secure, decentralized transactions beyond cryptocurrency. Smart contracts automate agreements without intermediaries. Industries use it for supply chain transparency. Challenges include scalability and energy use, but its tamper-proof nature revolutionizes digital trust and ownership systems globally.",
    "Quantum computing leverages qubits to solve complex problems exponentially faster. Applications include drug discovery and climate modeling. Google achieved quantum supremacy, but error correction remains a hurdle. This technology could break current encryption while enabling breakthroughs in material science.",
    "5G networks deliver ultra-low latency and gigabit speeds, enabling IoT and smart cities. Millimeter wave tech faces range limits but transforms telemedicine and autonomous vehicles. Deployment challenges include infrastructure costs, yet 5G forms the backbone of next-generation digital connectivity worldwide.",
    "The metaverse blends VR, AR, and social platforms into persistent digital worlds. Companies invest in virtual economies and avatars. Privacy and hardware accessibility remain concerns, but it could redefine remote work, education, and entertainment through spatial computing interfaces.",
    "Cybersecurity threats grow with digital transformation. Zero-trust frameworks and AI-driven defenses mitigate risks. Ethical hackers strengthen systems through bug bounties. As IoT expands, endpoint security becomes critical. Regulations like GDPR push for proactive data protection strategies against evolving threats.",
    "Edge computing processes data near its source, reducing cloud latency. Vital for autonomous drones and industrial IoT, it enhances privacy through localized processing. Managing distributed infrastructure is complex, but 5G synergy accelerates adoption in healthcare and smart grid applications.",
    "Robotics automates manufacturing, surgery, and logistics with precision. Collaborative robots work safely alongside humans. AI integration improves adaptability, though job displacement concerns persist. Boston Dynamics' agile machines demonstrate remarkable advances in mobility and dexterity.",
    "Biotechnology breakthroughs include CRISPR gene editing and mRNA vaccines. Synthetic biology engineers organisms for medicine and biofuels. Ethical debates surround designer babies, while personalized medicine and climate solutions drive innovation in this transformative field.",
    "Renewable energy technologies combat climate change through solar, wind, and advanced batteries. Perovskite solar cells and green hydrogen promise greater efficiency. Energy storage solutions address intermittency, while smart grids optimize distribution for sustainable power systems.",
    "Autonomous vehicles use LiDAR, cameras, and AI for navigation. Tesla and Waymo lead development, though regulatory hurdles remain. Benefits include reduced accidents and traffic. Future systems will integrate vehicle-to-everything communication for smarter transportation networks.",
    "Nanotechnology manipulates matter at atomic scales for advanced materials and drug delivery. Applications span electronics to medicine, though toxicity risks exist. Quantum dots in displays and targeted cancer treatments demonstrate its revolutionary potential.",
    "Augmented Reality overlays digital content onto physical environments via devices. It enhances retail, education, and maintenance. While hardware limitations persist, enterprise applications in training and design showcase AR's growing practical value across industries.",
    "Internet of Things connects devices from smart homes to industrial sensors. Security vulnerabilities challenge adoption, but 5G enables massive IoT deployments. Smart cities demonstrate how networked devices optimize energy use, traffic, and public services.",
    "Cloud computing provides scalable resources through services like AWS and Azure. Hybrid models balance flexibility with security. Serverless architectures reduce costs, though outages and data sovereignty concerns highlight risks of centralized infrastructure dependence.",
    "3D printing creates objects layer-by-layer for prototyping and production. Medical implants and aerospace components benefit from customization. While speed and material options improve, mass adoption awaits breakthroughs in large-scale manufacturing applications.",
    "Neural interfaces like Neuralink aim to connect brains with computers. Potential applications include treating neurological disorders. Ethical concerns persist, but the technology could eventually enhance cognition and redefine human-machine interaction profoundly.",
    "Digital twins create virtual replicas of physical systems for simulation. IoT integration enables predictive maintenance in industries. Though computationally intensive, they optimize performance in manufacturing, urban planning, and complex system management.",
    "Web3 envisions a decentralized internet using blockchain and tokens. NFTs and DAOs represent early use cases. While scalability issues and speculation exist, the movement seeks to redistribute power from tech giants to users.",
    "Space technology advances through reusable rockets and satellite networks. Private companies reduce launch costs while enabling new services. Future goals include asteroid mining and Mars colonization, requiring international cooperation and sustainable approaches.",
    "6G research targets terabit speeds and AI-integrated networks by 2030. Potential applications include holographic communication. Though in early stages, the technology promises to further blur physical and digital realities through advanced connectivity.",
    "Extended Reality combines VR, AR, and mixed reality for immersive training. Applications span medicine to entertainment. While motion sickness and costs limit adoption, improved hardware signals growing mainstream potential for XR technologies.",
    "Autonomous drones perform deliveries, inspections, and agricultural monitoring. AI enables complex swarm operations. Regulatory frameworks struggle to keep pace, but the technology's efficiency in logistics and emergency response drives rapid development.",
    "Green computing reduces IT's environmental impact through efficient data centers. Renewable-powered servers and recyclable hardware gain traction. The field balances performance demands with sustainability as digital infrastructure expands globally.",
    "Voice assistants process natural language for smart home control and queries. Privacy concerns persist, but improved contextual understanding expands their role in customer service and accessibility applications across industries.",
    "Biometrics like facial recognition enhance security systems. Controversies surround surveillance and bias, yet airports and smartphones increasingly rely on these technologies. Future systems may incorporate behavioral characteristics for more robust authentication.",
    "Smart cities use IoT sensors to optimize urban systems. Challenges include data privacy and equitable access, but pilot projects demonstrate reduced emissions and improved services through technology integration in urban planning.",
    "Computer vision enables machines to interpret visual data. Applications range from medical imaging to autonomous vehicles. While requiring vast training data, advances in deep learning continually improve recognition accuracy across diverse use cases.",
    "Wearable technology monitors health metrics through smartwatches and fitness trackers. Medical-grade devices enable remote patient monitoring. Future wearables may incorporate flexible electronics for more seamless integration with daily life and healthcare.",
    "Semiconductor advances continue despite physical limits. Smaller transistors enable more powerful chips, while new materials like graphene promise breakthroughs. The global chip shortage highlighted supply chain vulnerabilities in this foundational technology."
  ];
  return texts[Math.floor(Math.random() * texts.length)];
};

const TypingTest = () => {
  const { user } = useUser();
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION);
  const [isActive, setIsActive] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [mistakes, setMistakes] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [targetText, setTargetText] = useState(generateText());
  const [totalCharacters, setTotalCharacters] = useState(0); // Cumulative CORRECT characters from previous texts
  const [totalAttemptedCharacters, setTotalAttemptedCharacters] = useState(0); // Cumulative ATTEMPTED characters from previous texts
  const [finalStats, setFinalStats] = useState(null);
  const [resultSaved, setResultSaved] = useState(false);

  // Refs for stable callbacks inside timer effect
  const calculateStatsRef = useRef(null);
  const saveTestResultRef = useRef(null);
  const saveInitiatedRef = useRef(false); // Ref to track if save has been called

  // Save test result to Supabase
  const saveTestResult = useCallback(async (stats) => {
    if (resultSaved) {
      console.log('Test already saved, skipping...');
      return;
    }

    try {
      const testData = {
        user_email: user.emailAddresses[0].emailAddress,
        wpm: stats.wpm,
        accuracy: stats.accuracy,
        total_words: stats.total_words,
        timestamp: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('typing_results')
        .insert([testData]);

      if (error) throw error;
      console.log('Test result saved successfully:', testData);
      setResultSaved(true);
    } catch (error) {
      console.error('Error saving test result:', error);
    }
  }, [user, resultSaved]);

  // Calculate WPM and accuracy
  const calculateStats = useCallback((finalTimeLeft = timeLeft) => { // Accept optional final time
    if (!isActive && currentInput.length === 0 && totalCharacters === 0) {
      return { wpm: 0, total_words: 0, accuracy: 100 };
    }

    // Calculate time elapsed in minutes
    const timeElapsed = TIMER_DURATION - finalTimeLeft;
    const minutes = Math.max(timeElapsed / 60, 1/60); // Ensure minimum 1 sec duration

    // Calculate total CORRECT characters (cumulative previous + current correct)
    const currentCorrectChars = currentInput.split('').filter((char, i) => char === targetText[i]).length;
    const finalTotalCorrectChars = totalCharacters + currentCorrectChars;

    // Calculate words based on total correct characters
    const words = Math.round(finalTotalCorrectChars / 5);
    
    // Calculate WPM
    const wpm = Math.round(words / minutes);

    // Calculate cumulative accuracy
    const finalTotalAttemptedChars = totalAttemptedCharacters + currentInput.length;
    const accuracyScore = finalTotalAttemptedChars === 0 ? 100 :
      Math.max(0, Math.round((finalTotalCorrectChars / finalTotalAttemptedChars) * 100));

    return {
      wpm: Math.min(wpm, 250), // Cap WPM
      total_words: words,
      accuracy: accuracyScore,
    };
  }, [
    currentInput, 
    targetText, 
    timeLeft, 
    isActive, 
    totalCharacters, 
    totalAttemptedCharacters
  ]);

  // Keep refs updated with the latest callbacks
  useEffect(() => {
    calculateStatsRef.current = calculateStats;
  }, [calculateStats]);

  useEffect(() => {
    saveTestResultRef.current = saveTestResult;
  }, [saveTestResult]);

  // Start timer when first character is typed
  useEffect(() => {
    if (currentInput.length === 1 && !isActive) {
      setIsActive(true);
    }
  }, [currentInput, isActive]);

  // Handle timer countdown
  useEffect(() => {
    let interval;

    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(interval);
            setIsActive(false); // Stop the test first
            
            // Use refs to call the latest functions
            if (calculateStatsRef.current && !saveInitiatedRef.current) { // Check saveInitiatedRef
              saveInitiatedRef.current = true; // Set flag immediately

              const finalCalculatedStats = calculateStatsRef.current(0); 
              setFinalStats(finalCalculatedStats);
              setShowResults(true);
              
              // Check resultSaved state directly here might be safer
              // Or rely on saveTestResultRef checking it internally
              if (saveTestResultRef.current) {
                 saveTestResultRef.current(finalCalculatedStats); 
              }
            }
            return 0; 
          }
          return prevTime - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
    // Timer effect now ONLY depends on isActive
  }, [isActive]); // Removed dependencies, using refs instead

  // Handle input changes
  const handleInputChange = (e) => {
    const value = e.target.value;
    setCurrentInput(value);

    // Count correctly typed characters for the current text
    let correctChars = 0;
    const textLength = Math.min(value.length, targetText.length);
    for (let i = 0; i < textLength; i++) {
      if (value[i] === targetText[i]) {
        correctChars++;
      }
    }

    // Move to next text if current text is completed
    if (value.length >= targetText.length && timeLeft > 0) {
      // Add this segment's stats to cumulative totals
      setTotalCharacters(prev => prev + correctChars);
      setTotalAttemptedCharacters(prev => prev + targetText.length); // Add length of completed text
      
      // Generate new text and reset input
      setTargetText(generateText());
      setCurrentInput('');
    }
  };

  const handleRetry = () => {
    // First stop any ongoing test
    setIsActive(false);
    
    // Reset all state
    setTimeLeft(TIMER_DURATION);
    setCurrentInput('');
    setTargetText(generateText());
    setShowResults(false);
    setMistakes(0); // Also reset mistakes state if you are tracking it explicitly
    setTotalCharacters(0);
    setTotalAttemptedCharacters(0); // Reset attempted chars too
    setFinalStats(null);
    setResultSaved(false);
    saveInitiatedRef.current = false; // Reset save initiated flag
  };

  const stats = calculateStats();

  return (
    <>
      <div className="typing-test glass">
        <div className="test-header">
          <div className="timer">{timeLeft}s</div>
          <div className="stats">
            <div className="stat">
              <span className="stat-label">WPM: </span>
              <span className="stat-value">{stats.wpm}</span>
            </div>
            <div className="stat">
              <span className="stat-label">ACCURACY: </span>
              <span className="stat-value">{stats.accuracy}%</span>
            </div>
          </div>
        </div>

        <div className="test-content">
          <div className="sample-text">
            {targetText.split('').map((char, index) => {
              let status = '';
              if (index < currentInput.length) {
                status = currentInput[index] === char ? 'correct' : 'incorrect';
              }
              return (
                <span key={index} className={status}>
                  {char}
                </span>
              );
            })}
          </div>
          <textarea
            className="typing-input"
            value={currentInput}
            onChange={handleInputChange}
            onPaste={(e) => e.preventDefault()} // Prevent pasting
            onCopy={(e) => e.preventDefault()} // Prevent copying
            onCut={(e) => e.preventDefault()} // Prevent cutting
            onDrop={(e) => e.preventDefault()} // Prevent drag and drop
            placeholder="Start typing to begin..."
            disabled={timeLeft === 0}
            spellCheck="false" // Disable spell check
            autoCorrect="off" // Disable autocorrect
            autoCapitalize="off" // Disable auto capitalize
          />
        </div>
      </div>

      {showResults && finalStats && (
        <div className="results-overlay">
          <div className="results">
            <h2>Test Complete!</h2>
            <p className="result-subtitle">Here's how you performed</p>
            <div className="result-stats">
              <div className="result-stat">
                <span className="stat-label">Words Per Minute</span>
                <span className="stat-value">{finalStats.wpm}</span>
                <span className="stat-desc">Speed</span>
              </div>
              <div className="result-stat">
                <span className="stat-label">Total Words</span>
                <span className="stat-value">{finalStats.total_words}</span>
                <span className="stat-desc">Words Typed</span>
              </div>
              <div className="result-stat">
                <span className="stat-label">Accuracy</span>
                <span className="stat-value">{finalStats.accuracy}%</span>
                <span className="stat-desc">Precision</span>
              </div>
            </div>
            <button className="retry-button" onClick={handleRetry}>
              Try Again
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default TypingTest;
