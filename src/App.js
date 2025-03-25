import React, { useState, useEffect } from 'react';
import RibbonCutting from './components/RibbonCutting';
import './App.css';

function App() {
  const [ribbonCut, setRibbonCut] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const resetAnimation = () => {
    setRibbonCut(false);
    setShowCelebration(false);
  };

  // Add ribbon cut effect
  useEffect(() => {
    if (ribbonCut && !showCelebration) {
      // Show celebration with delay
      const timer = setTimeout(() => {
        setShowCelebration(true);
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [ribbonCut, showCelebration]);

  // Add keyboard event listeners
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Space or Enter to cut the ribbon
      if ((e.key === ' ' || e.key === 'Enter') && !ribbonCut) {
        setRibbonCut(true);
      }
      // Esc to reset
      if (e.key === 'Escape' && ribbonCut) {
        resetAnimation();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    
    // Clean up event listener on unmount
    return () => {
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
