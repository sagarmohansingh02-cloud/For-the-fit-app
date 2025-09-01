import React from 'react';
import { playSound } from '../services/soundService';
import SoundToggle from './SoundToggle';

type Page = 'home' | 'tool' | 'about' | 'contact' | 'privacy' | 'terms';

interface HeaderProps {
  currentPage: Page;
  onNavigate: (page: Page, sectionId?: string) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const handleNavClick = (page: Page, sectionId?: string) => {
    playSound('click');
    onNavigate(page, sectionId);
  };

  return (
    <header className="text-center py-4 shadow-md backdrop-blur-sm sticky top-0 z-20 border-b border-slate-800 animate-page-fade-in">
      <div className="container mx-auto flex justify-between items-center px-4">
        <button 
          onClick={() => handleNavClick('home')}
          className="flex flex-col items-start"
          aria-label="Navigate to home page"
        >
          <h1 className="text-2xl font-extrabold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 to-violet-400">
              For The Fit
            </span>
          </h1>
          <p className="text-xs text-slate-400 -mt-1">AI Virtual Try-on</p>
        </button>
        
        <nav className="hidden md:flex items-center space-x-6 text-slate-300">
          <button onClick={() => handleNavClick('home', 'how-it-works')} className="hover:text-violet-400 transition-colors">How It Works</button>
          <button onClick={() => handleNavClick('home', 'features')} className="hover:text-violet-400 transition-colors">Features</button>
          <button onClick={() => handleNavClick('home', 'faq')} className="hover:text-violet-400 transition-colors">FAQ</button>
        </nav>
        
        <div className="flex items-center gap-4">
          <SoundToggle />
          <button
            onClick={() => handleNavClick('tool')}
            className="px-5 py-2 bg-slate-800/80 border border-slate-700 text-sm text-white font-semibold rounded-lg hover:bg-violet-600 hover:border-violet-600 hover:shadow-[0_0_15px_rgba(139,92,246,0.4)] transition-all duration-300 transform hover:scale-105"
          >
            Try Now
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;