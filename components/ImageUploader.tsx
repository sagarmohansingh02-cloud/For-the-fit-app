import React, { useCallback, useState, useEffect } from 'react';
import UploadIcon from './icons/UploadIcon';
import ZoomIcon from './icons/ZoomIcon';
import { playSound } from '../services/soundService';

interface ImageUploaderProps {
  title: string;
  description: string;
  onFileSelect: (file: File | null) => void;
  file: File | null;
  aspectRatioHint?: string;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ title, description, onFileSelect, file, aspectRatioHint }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  
  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    onFileSelect(selectedFile);
    if (selectedFile) {
      playSound('upload');
    }
  };

  const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onFileSelect(null);
    playSound('click');
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files && e.dataTransfer.files[0] ? e.dataTransfer.files[0] : null;
    if (droppedFile) {
      onFileSelect(droppedFile);
      playSound('upload');
    }
  }, [onFileSelect]);

  const handleDragEvents = (e: React.DragEvent<HTMLLabelElement>, dragging: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(dragging);
  };

  return (
    <div className="flex flex-col items-center">
      <h3 className="text-lg font-semibold text-slate-300 mb-2">{title}</h3>
      <label
        onDrop={handleDrop}
        onDragOver={(e) => handleDragEvents(e, true)}
        onDragEnter={(e) => handleDragEvents(e, true)}
        onDragLeave={(e) => handleDragEvents(e, false)}
        className={`group w-full h-64 border-2 border-dashed rounded-lg flex flex-col justify-center items-center text-center p-2 cursor-pointer transition-all duration-300 ease-in-out relative overflow-hidden transform-gpu ${
          isDragging
            ? 'border-violet-500 bg-slate-800/50 scale-105 ring-4 ring-violet-500/40'
            : 'border-slate-700 hover:border-violet-500 hover:bg-[#111827]/80 hover:scale-105 hover:shadow-[0_0_15px_rgba(139,92,246,0.3)]'
        }`}
      >
        <div className={`transition-opacity duration-300 ${preview ? 'opacity-0' : 'opacity-100'}`}>
          <div className="pointer-events-none">
            <UploadIcon className="w-12 h-12 mx-auto mb-2 text-slate-600 group-hover:text-violet-400 transition-colors" />
            <p className="font-semibold text-slate-400 group-hover:text-violet-300 transition-colors">Click to upload or drag & drop</p>
            <p className="text-xs mt-1 text-slate-500 group-hover:text-slate-400 transition-colors">{description}</p>
            {aspectRatioHint && (
              <p className="text-xs mt-1 text-slate-600 group-hover:text-slate-500 transition-colors">
                Tip: {aspectRatioHint} photo works best.
              </p>
            )}
          </div>
        </div>
        
        {preview && (
          <>
            <img 
              src={preview} 
              alt="Preview" 
              className="absolute inset-0 w-full h-full object-contain transition-transform duration-300 ease-in-out group-hover:scale-110 animate-fade-in" 
            />
            <button
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 z-20 p-1.5 bg-slate-900/70 rounded-full text-slate-300 hover:bg-red-600 hover:text-white transition-all duration-200 transform hover:scale-110"
              aria-label="Remove image"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div
              className="absolute bottom-2 right-2 z-10 p-2 bg-slate-900/70 rounded-full text-slate-300 opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
              aria-hidden="true"
            >
              <ZoomIcon className="w-5 h-5" />
            </div>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </label>
       <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ImageUploader;