
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GridConfigurator } from '@/components/grid-configurator';
import { ButtonGrid } from '@/components/button-grid';
import { StepIndicator } from '@/components/step-indicator';
import { PlaybackControls } from '@/components/playback-controls'; // Ensure this path is correct now
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export type GridSize = `${number}x${number}`;

export default function Home() {
  const [gridSize, setGridSize] = useState<GridSize>('3x3');
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
  }, [gridSize]);

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

  const handleGridSizeChange = (newSize: GridSize) => {
    setGridSize(newSize);
  };

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
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-12 bg-background text-foreground">
       {/* Use a subtle gradient background for the card */}
      <Card className="w-full max-w-4xl shadow-2xl rounded-xl border-2 border-border/50 bg-gradient-to-br from-card to-card/90">
        <CardHeader className="flex flex-col items-center space-y-4 pb-6 pt-8 border-b border-border/30">
          {/* Centralized Header Content */}
           <div className="text-center">
             <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight text-shadow-sm">GridRecall</CardTitle>
             <CardDescription className="text-center text-muted-foreground mt-2">
               Memorize sequences visually. Click buttons to log steps, use controls to review.
             </CardDescription>
           </div>
            {/* Grid Configurator - now below the title */}
            <div className="pt-4">
               <GridConfigurator gridSize={gridSize} onGridSizeChange={handleGridSizeChange} />
            </div>
        </CardHeader>
        <CardContent className="space-y-12 p-6 md:p-8 lg:p-10"> {/* Increased space-y for more room */}
          {/* Enhanced Control Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 p-4 bg-muted/60 rounded-lg shadow-inner relative border border-border/40"> {/* Increased gap */}
            {/* Left Aligned Reset Button */}
            <div className="">
              <Button onClick={handleReset} variant="destructive" size="default" aria-label="Reset Sequence">
                <RotateCcw className="h-5 w-5 mr-2" /> Reset
              </Button>
            </div>

            {/* Centered Step Indicator */}
            <div className="flex-grow flex items-center justify-center">
               <StepIndicator
                  currentStep={currentStep} // Always show the manually controlled/synced step
                  totalSteps={sequence.length}
                  onPrevious={handlePreviousStep}
                  onNext={handleNextStep}
                  isSequenceEmpty={sequence.length === 0}
                  disabled={isPlaying} // Disable manual steps during playback
               />
            </div>

            {/* Right Aligned Playback Controls */}
            <div className="">
               <PlaybackControls // Use the corrected component name
                  isPlaying={isPlaying}
                  onPlay={handlePlay}
                  onPause={handlePause}
                  onStop={handleStop}
                  // Disable play/pause if sequence is empty, Stop is handled within its component
                  disabled={sequence.length === 0}
               />
            </div>
          </div>

          {/* Button Grid */}
          <div className="flex justify-center">
            <ButtonGrid
              rows={rows}
              cols={cols}
              sequence={sequence}
              // Pass the unified currentStep for display logic
              currentStep={currentStep}
              onButtonClick={handleButtonClick}
              disabled={isPlaying} // Disable grid interaction during playback
            />
           </div>
        </CardContent>
      </Card>
    </main>
  );
}

