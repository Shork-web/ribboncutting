import React, { useState, useEffect } from 'react';
import RibbonCutting from './components/RibbonCutting';
import './App.css';

function App() {
  const [ribbonCut, setRibbonCut] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  // Add console log for tracking re-renders
  console.log("App component rendered, ribbonCut:", ribbonCut);
  
  const resetAnimation = () => {
    console.log("resetAnimation called");
    setRibbonCut(false);
    setShowCelebration(false);
  };

  // Add ribbon cut effect
  useEffect(() => {
    console.log("Celebration effect running, ribbonCut:", ribbonCut, "showCelebration:", showCelebration);
    if (ribbonCut && !showCelebration) {
      // Show celebration with delay
      console.log("Setting up celebration timer");
      const timer = setTimeout(() => {
        console.log("Showing celebration");
        setShowCelebration(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [ribbonCut, showCelebration]);

  // Add keyboard event listeners
  useEffect(() => {
    console.log("Setting up keyboard listeners");
    
    const handleKeyDown = (e) => {
      // Space or Enter to cut the ribbon
      if ((e.key === ' ' || e.key === 'Enter') && !ribbonCut) {
        console.log("Space/Enter pressed, setting ribbonCut to true");
        setRibbonCut(true);
      }
      // Esc to reset
      if (e.key === 'Escape' && ribbonCut) {
        console.log("Escape pressed, resetting animation");
        resetAnimation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up event listener on unmount
    return () => {
      console.log("Cleaning up keyboard listeners");
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [ribbonCut]);

  return (
    <div className="app-container">
      <h1 className="title">Virtual Ribbon Cutting Ceremony</h1>
      
      <div className="logo">
        <img src="/assets/citlogo.png" alt="CIT Logo" />
      </div>
      
      <RibbonCutting 
        ribbonColor="#ff0000" 
        width={6}
        isCut={ribbonCut}
      />
      
      {showCelebration && (
        <div className="celebration">
          🎉 Congratulations! 🎉
        </div>
      )}
    </div>
  );
}

export default App;
