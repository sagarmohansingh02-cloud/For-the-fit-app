import React, { useState, useEffect, useRef } from 'react';
import SpinnerIcon from './icons/SpinnerIcon';
import DownloadIcon from './icons/DownloadIcon';
import ErrorIcon from './icons/ErrorIcon';
import { playSound } from '../services/soundService';

interface ResultDisplayProps {
  generatedImage: string | null;
  isLoading: boolean;
  error: string | null;
}

const loadingMessages = [
  'Analyzing pose...',
  'Mapping outfit to your form...',
  'Applying fabric textures...',
  'Adjusting lighting and shadows...',
  'Rendering final details...',
  'Stitching the final image...',
  'Almost showtime...',
];

const ResultDisplay: React.FC<ResultDisplayProps> = ({ generatedImage, isLoading, error }) => {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const prevGeneratedImageRef = useRef<string | null>(null);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);
  
  useEffect(() => {
    if (generatedImage && !prevGeneratedImageRef.current) {
      playSound('success');
    }
    prevGeneratedImageRef.current = generatedImage;
  }, [generatedImage]);


  const handleDownload = () => {
    playSound('click');
    if (!generatedImage) return;
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `for-the-fit-try-on-${Date.now()}.png`; 
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <div className="w-full min-h-[20rem] md:min-h-[29.5rem] bg-[#0c0e1a]/50 rounded-lg flex justify-center items-center p-4 relative overflow-hidden transition-all duration-300 border border-slate-800">
      {isLoading && (
        <div className="flex flex-col items-center text-slate-400 text-center">
          <SpinnerIcon className="w-16 h-16 animate-spin text-violet-500" />
          <p className="mt-4 text-lg font-semibold transition-opacity duration-500">{loadingMessages[currentMessageIndex]}</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="text-center text-red-400 flex flex-col items-center p-4">
          <ErrorIcon className="w-16 h-16 text-red-500/80 mb-4" />
          <h3 className="text-xl font-bold mb-2">Oops! Something went wrong.</h3>
          <p className="text-sm">{error}</p>
        </div>
      )}

      {generatedImage && !isLoading && (
        <>
          <img
            src={generatedImage}
            alt="Generated virtual try-on"
            className="w-full h-full object-contain rounded-md animate-result-in"
          />
          <button
            onClick={handleDownload}
            className="absolute bottom-4 right-4 z-10 p-3 bg-gradient-to-r from-pink-500 to-violet-600 rounded-full text-white shadow-lg hover:shadow-2xl hover:shadow-pink-500/40 transition-all duration-300 transform hover:scale-110 hover:-translate-y-0.5 active:scale-95"
            aria-label="Download image"
            title="Download Image"
          >
            <DownloadIcon className="w-6 h-6" />
          </button>
        </>
      )}

      {!isLoading && !error && !generatedImage && (
        <div className="text-center text-slate-500 p-4">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-pink-500/20 to-violet-600/20 mx-auto mb-4 flex items-center justify-center animate-pulse">
            <svg className="w-12 h-12 text-slate-700" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-slate-400">Your new look will appear here.</p>
          <p className="text-sm">Upload your images and click "Get The Fit".</p>
        </div>
      )}
      <style>{`
        @keyframes result-in {
          from {
            opacity: 0;
            transform: scale(0.95);
            filter: blur(4px);
          }
          to {
            opacity: 1;
            transform: scale(1);
            filter: blur(0);
          }
        }
        .animate-result-in {
          animation: result-in 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
      `}</style>
    </div>
  );
};

export default ResultDisplay;