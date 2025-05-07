
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { GridConfigurator } from '@/components/grid-configurator'; // Removed
import { ButtonGrid } from '@/components/button-grid';
import { StepIndicator } from '@/components/step-indicator';
import { PlaybackControls } from '@/components/playback-controls';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export type GridSize = `${number}x${number}`;

export default function Home() {
  const [gridSize] = useState<GridSize>('3x3'); // Hardcoded to 3x3, removed setGridSize
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [isClient, setIsClient] = useState(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackStep, setPlaybackStep] = useState<number>(0);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Set client flag after hydration
    setIsClient(true);
    const [r, c] = gridSize.split('x').map(Number);
    setRows(r);
    setCols(c);
    setSequence([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setPlaybackStep(0);
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
      playbackIntervalRef.current = null;
    }
  }, [gridSize]); // gridSize is now constant, so this runs once on mount

   // Effect for handling playback
  useEffect(() => {
    if (isPlaying) {
      playbackIntervalRef.current = setInterval(() => {
        setPlaybackStep((prev) => {
          const nextStep = prev + 1;
          if (nextStep <= sequence.length) {
             // Sync currentStep with playbackStep during playback
             setCurrentStep(nextStep);
            return nextStep;
          } else {
            // Stop playback when sequence ends
            setIsPlaying(false);
            if (playbackIntervalRef.current) {
              clearInterval(playbackIntervalRef.current);
              playbackIntervalRef.current = null;
            }
            // Keep at the end after finishing playback
            return prev;
          }
        });
      }, 800); // Adjust speed as needed (e.g., 800ms per step)
    } else {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
        playbackIntervalRef.current = null;
      }
      // When stopping or pausing, update the manual step indicator
      setCurrentStep(playbackStep);
    }

    // Cleanup interval on component unmount or when isPlaying changes
    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, [isPlaying, sequence.length, playbackStep]); // Updated dependencies

  // Removed handleGridSizeChange

  const handleButtonClick = (index: number) => {
    if (isPlaying) return; // Prevent adding steps during playback
    setSequence((prevSequence) => {
      const newSequence = [...prevSequence, index];
      setCurrentStep(newSequence.length);
      // Also update playbackStep when manually adding, so playback can start from the end
      setPlaybackStep(newSequence.length);
      return newSequence;
    });
  };


  const handleReset = () => {
    setSequence([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setPlaybackStep(0);
     if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
      playbackIntervalRef.current = null;
    }
  };

  const handlePreviousStep = () => {
    if (isPlaying) return; // Prevent manual control during playback
    setCurrentStep((prevStep) => {
      const newStep = Math.max(0, prevStep - 1);
      setPlaybackStep(newStep); // Sync playback step
      return newStep;
    });
  };

  const handleNextStep = () => {
    if (isPlaying) return; // Prevent manual control during playback
    setCurrentStep((prevStep) => {
      const newStep = Math.min(sequence.length, prevStep + 1);
      setPlaybackStep(newStep); // Sync playback step
      return newStep;
    });
  };

 const handlePlay = useCallback(() => {
    if (sequence.length === 0) return;
    if (playbackStep >= sequence.length) {
      // If at the end, restart from the beginning
      setPlaybackStep(0);
      setCurrentStep(0); // Reset manual step indicator as well
    } else {
       // Otherwise, ensure playback starts from the current playbackStep
       // No change needed to playbackStep here, just ensure currentStep matches
       setCurrentStep(playbackStep);
    }
    setIsPlaying(true);
  }, [sequence.length, playbackStep]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    // currentStep will be updated by the useEffect when isPlaying becomes false
  }, []);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
    setPlaybackStep(0); // Reset playback to the beginning
    setCurrentStep(0);   // Reset manual step indicator
  }, []);


  if (!isClient) {
    // Render placeholder or null during SSR/prerender
    return (
       <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-12 bg-background text-foreground">
         <Card className="w-full max-w-4xl shadow-2xl rounded-xl border-2 border-border/50 bg-gradient-to-br from-card to-card/90">
           <CardHeader className="flex flex-col items-center space-y-4 pb-6 pt-8 border-b border-border/30">
             <div className="text-center">
                <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight text-shadow-sm">GridRecall</CardTitle>
                <CardDescription className="text-center text-muted-foreground mt-2">
                    Memorize sequences visually. Click buttons to log steps, use controls to review.
                </CardDescription>
             </div>
           </CardHeader>
           <CardContent className="flex flex-col items-center justify-center space-y-12 py-10"> {/* Increased space-y */}
             <div className="text-muted-foreground animate-pulse text-lg">Loading Interface...</div>
           </CardContent>
         </Card>
       </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-12 bg-background text-foreground" style={{backgroundImage: "url('/images/background-texture.svg')", backgroundSize: 'cover', backgroundPosition: 'center'}}>
      {/* Enhanced card with better visual effects */}
      <Card className="w-full max-w-4xl shadow-[0_10px_40px_-15px_rgba(0,0,0,0.3)] rounded-xl border border-white/10 bg-gradient-to-br from-card/80 via-card/75 to-card/80 backdrop-blur-md overflow-hidden">
        {/* Header with subtle glow effect */}
        <CardHeader className="flex flex-col items-center space-y-5 pb-7 pt-8 border-b border-white/10 bg-gradient-to-b from-accent/5 to-transparent">
          {/* Animated title with glow effect */}
          <div className="text-center relative">
            {/* Decorative elements */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-40 h-40 bg-accent/10 rounded-full blur-3xl -z-10"></div>
            
            <CardTitle className="text-3xl md:text-5xl font-extrabold tracking-tight text-glow animate-pulse-slow bg-gradient-to-r from-accent/90 via-foreground to-accent/90 bg-clip-text text-transparent">
              GridRecall
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground mt-3 text-base md:text-lg max-w-md mx-auto">
              Memorize sequences on a 3x3 grid. Click buttons to log steps, use controls to review.
            </CardDescription>
          </div>
          
          {/* Grid Configurator removed */}
        </CardHeader>
        
        <CardContent className="space-y-12 p-6 md:p-8 lg:p-10 relative">
          {/* Decorative accent elements */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-accent/5 rounded-full blur-3xl -z-10"></div>
          
          {/* Enhanced Control Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 p-5 glass-effect rounded-xl inner-glow relative">
            {/* Left Aligned Reset Button with enhanced styling */}
            <div className="z-10">
              <Button 
                onClick={handleReset} 
                variant="destructive" 
                size="default" 
                aria-label="Reset Sequence"
                className="font-semibold shadow-lg hover:shadow-destructive/20 transition-all duration-300 rounded-full px-5 hover:-translate-y-1 hover:scale-105 active:scale-95"
              >
                <RotateCcw className="h-5 w-5 mr-2 animate-spin-slow" /> Reset
              </Button>
            </div>

            {/* Centered Step Indicator */}
            <div className="flex-grow flex items-center justify-center z-10">
              <StepIndicator
                currentStep={currentStep}
                totalSteps={sequence.length}
                onPrevious={handlePreviousStep}
                onNext={handleNextStep}
                isSequenceEmpty={sequence.length === 0}
                disabled={isPlaying}
              />
            </div>

            {/* Right Aligned Playback Controls */}
            <div className="z-10">
              <PlaybackControls
                isPlaying={isPlaying}
                onPlay={handlePlay}
                onPause={handlePause}
                onStop={handleStop}
                disabled={sequence.length === 0}
              />
            </div>
          </div>

          {/* Button Grid with animation */}
          <div className="flex justify-center animate-float">
            <ButtonGrid
              rows={rows}
              cols={cols}
              sequence={sequence}
              currentStep={currentStep}
              onButtonClick={handleButtonClick}
              disabled={isPlaying}
            />
          </div>
          
          {/* Enhanced instruction panel */}
          <div className="mt-8 text-center text-sm text-muted-foreground glass-effect rounded-lg p-4 border border-white/10 shadow-lg relative overflow-hidden">
            {/* Decorative accent */}
            <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-accent/5 opacity-30"></div>
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-accent/30 to-transparent"></div>
            
            <p className="relative z-10 font-medium">
              Create a sequence by clicking buttons, then use playback controls to review your pattern.
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
