import React, { useState, useEffect } from 'react';
import { isSoundEnabled, toggleSound, playSound } from '../services/soundService';
import SoundOnIcon from './icons/SoundOnIcon';
import SoundOffIcon from './icons/SoundOffIcon';

const SoundToggle: React.FC = () => {
  const [soundEnabled, setSoundEnabled] = useState(isSoundEnabled);

  const handleToggle = () => {
    // We play the sound before toggling the state
    if (!isSoundEnabled()) {
      playSound('toggle');
    }
    const newState = toggleSound();
    setSoundEnabled(newState);
  };
  
  // Listen for storage changes from other tabs to keep UI in sync
  useEffect(() => {
    const handleStorageChange = () => {
      setSoundEnabled(isSoundEnabled());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return (
    <button
      onClick={handleToggle}
      className="p-2 bg-slate-800/80 border border-slate-700 rounded-lg text-slate-300 hover:bg-slate-700/80 hover:border-slate-500 transition-all duration-300 transform hover:scale-110"
      aria-label={soundEnabled ? 'Disable sound effects' : 'Enable sound effects'}
      title={soundEnabled ? 'Mute Sounds' : 'Unmute Sounds'}
    >
      {soundEnabled ? <SoundOnIcon className="w-5 h-5" /> : <SoundOffIcon className="w-5 h-5" />}
    </button>
  );
};

export default SoundToggle;
