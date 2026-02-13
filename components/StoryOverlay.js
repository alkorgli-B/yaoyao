"use client";
import React, { useState, useEffect } from 'react';

const storySteps = [
  { id: 1, text: "Yaoyao... can you hear me? You are lost in the Neon Void.", delay: 2000 },
  { id: 2, text: "The Digital City has stolen your energy. You must find the 5 Power Crystals.", delay: 5000 },
  { id: 3, text: "Move swiftly! Each crystal opens a path back home to Earth.", delay: 8000 },
];

export default function StoryOverlay({ isPlaying }) {
  const [currentText, setCurrentText] = useState("");

  useEffect(() => {
    if (isPlaying) {
      storySteps.forEach((step, index) => {
        setTimeout(() => {
          setCurrentText(step.text);
          // إخفاء النص بعد فترة
          setTimeout(() => setCurrentText(""), 3000);
        }, step.delay);
      });
    }
  }, [isPlaying]);

  if (!currentText) return null;

  return (
    <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-4 pointer-events-none">
      <div className="bg-black/80 border-l-4 border-cyan-400 p-4 backdrop-blur-md animate-in fade-in slide-in-from-bottom-4 duration-500">
        <p className="font-mono text-cyan-400 text-sm leading-relaxed tracking-tight">
          <span className="text-white font-bold">[MISSION_LOG]:</span> {currentText}
        </p>
      </div>
    </div>
  );
}
