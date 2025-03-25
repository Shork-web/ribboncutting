import React, { useState, useEffect } from 'react';
import { Background } from './Background';

// Global variable to track if background has been created
let backgroundInstance = null;
let instanceCounter = 0;

// SingletonBackground ensures the background is created only once
export const SingletonBackground = React.memo(() => {
  const [instance] = useState(() => {
    // Only create a new instance if one doesn't exist
    if (!backgroundInstance) {
      console.log("Creating NEW background instance");
      backgroundInstance = <Background />;
    } else {
      console.log("Reusing existing background instance", ++instanceCounter);
    }
    return backgroundInstance;
  });

  // Force clean-up of instance if this component is unmounted
  useEffect(() => {
    return () => {
      console.log("SingletonBackground cleaning up");
      // We don't actually clean up the instance because we want it to persist
      // This is intentional to maintain the singleton pattern
    };
  }, []);

  return instance;
}); 