import React, { useState } from 'react';
import RibbonCutting from './components/RibbonCutting';
import './App.css';

function App() {
  const [ribbonCut, setRibbonCut] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const handleRibbonCut = () => {
    setRibbonCut(true);
    setTimeout(() => {
      setShowCelebration(true);
    }, 1500);
  };
  
  const resetAnimation = () => {
    setRibbonCut(false);
    setShowCelebration(false);
  };

  return (
    <div className="app-container">
      <h1 className="title">Virtual Ribbon Cutting Ceremony</h1>
      
      <RibbonCutting 
        ribbonColor="#ff0000" 
        width={6}
        isCut={ribbonCut}
        onComplete={handleRibbonCut} 
      />
      
      <div className="controls">
        <button 
          className="cut-button" 
          onClick={() => setRibbonCut(true)} 
          disabled={ribbonCut}
        >
          Cut the Ribbon
        </button>
        
        <button 
          className="reset-button" 
          onClick={resetAnimation}
          disabled={!ribbonCut}
        >
          Reset
        </button>
      </div>
      
      {showCelebration && (
        <div className="celebration">
          🎉 Congratulations! 🎉
        </div>
      )}
    </div>
  );
}

export default App;
