
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GridConfigurator } from '@/components/grid-configurator';
import { ButtonGrid } from '@/components/button-grid';
import { StepIndicator } from '@/components/step-indicator';
import { PlayControls } from '@/components/play-controls';
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
          if (prev < sequence.length) {
            return prev + 1;
          } else {
            // Stop playback when sequence ends
            setIsPlaying(false);
            if (playbackIntervalRef.current) {
              clearInterval(playbackIntervalRef.current);
              playbackIntervalRef.current = null;
            }
            // Optionally reset to the beginning after finishing playback
             // setCurrentStep(0);
             // return 0;
             // Or keep at the end:
             return prev;
          }
        });
      }, 800); // Adjust speed as needed (e.g., 800ms per step)
    } else {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
        playbackIntervalRef.current = null;
      }
      // When stopping or pausing, keep the playback step where it is
      // setPlaybackStep(playbackStep); // No need to set it to itself
    }

    // Cleanup interval on component unmount or when isPlaying changes
    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, [isPlaying, sequence.length, playbackStep]); // Added playbackStep to dependencies

  const handleGridSizeChange = (newSize: GridSize) => {
    setGridSize(newSize);
  };

  const handleButtonClick = (index: number) => {
     // Allow adding steps only when not playing back
    if (isPlaying) return;
    setSequence((prevSequence) => {
      const newSequence = [...prevSequence, index];
      // When adding a new step, make sure the currentStep reflects the new total length
      setCurrentStep(newSequence.length);
       // Optionally, sync playbackStep if needed, though generally not required when adding
      // setPlaybackStep(newSequence.length);
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
    // Allow manual control only when not playing back
    if (isPlaying) return;
    setCurrentStep((prevStep) => {
      const newStep = Math.max(0, prevStep - 1);
      setPlaybackStep(newStep); // Sync playback step to manual step
      return newStep;
    });
  };

  const handleNextStep = () => {
    // Allow manual control only when not playing back
    if (isPlaying) return;
    setCurrentStep((prevStep) => {
      const newStep = Math.min(sequence.length, prevStep + 1);
      setPlaybackStep(newStep); // Sync playback step to manual step
      return newStep;
    });
  };

  const handlePlay = useCallback(() => {
    if (sequence.length === 0) return;
     // If playback is already at the end, restart from beginning
    if (playbackStep >= sequence.length) {
       setPlaybackStep(0);
       setCurrentStep(0); // Also reset manual step indicator if restarting
    } else {
       // Otherwise, resume from the current playbackStep
       // No state change needed here, useEffect handles interval start
    }
    setIsPlaying(true);
    // When playing, synchronize the manual step indicator with the playback
    setCurrentStep(playbackStep);
  }, [sequence.length, playbackStep]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
    // When pausing, update the manual step indicator to the current playback position
    setCurrentStep(playbackStep);
  }, [playbackStep]);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
    setPlaybackStep(0); // Reset playback to the beginning
    setCurrentStep(0); // Also reset manual step indicator to the start
  }, []);


  if (!isClient) {
    // Render placeholder or null during SSR/prerender
    return (
       <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-12 bg-background text-foreground">
         <Card className="w-full max-w-3xl shadow-xl rounded-xl border-2 border-border/50 bg-gradient-to-br from-card to-card/90">
           <CardHeader className="flex flex-col items-center space-y-4 pb-6 pt-8">
             <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight text-shadow-sm">GridRecall</CardTitle>
             <CardDescription className="text-center text-muted-foreground">
               Memorize sequences visually. Click buttons to log steps, use controls to review.
             </CardDescription>
           </CardHeader>
           <CardContent className="flex flex-col items-center justify-center space-y-8 py-8">
             <div className="text-muted-foreground animate-pulse">Loading Interface...</div>
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
        <CardContent className="space-y-10 p-6 md:p-8 lg:p-10">
          {/* Enhanced Control Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 p-4 bg-muted/60 rounded-lg shadow-inner relative border border-border/40">
            {/* Left Aligned Reset Button */}
            <div className="">
              <Button onClick={handleReset} variant="destructive" size="default" aria-label="Reset Sequence">
                <RotateCcw className="h-5 w-5 mr-2" /> Reset
              </Button>
            </div>

            {/* Centered Step Indicator */}
            <div className="flex-grow flex items-center justify-center">
               <StepIndicator
                  currentStep={isPlaying ? playbackStep : currentStep}
                  totalSteps={sequence.length}
                  onPrevious={handlePreviousStep}
                  onNext={handleNextStep}
                  isSequenceEmpty={sequence.length === 0}
                  disabled={isPlaying} // Disable manual steps during playback
               />
            </div>

            {/* Right Aligned Play Controls */}
            <div className="">
               <PlayControls
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
              // Use playbackStep if playing, otherwise use currentStep
              currentStep={isPlaying ? playbackStep : currentStep}
              onButtonClick={handleButtonClick}
              disabled={isPlaying} // Disable grid interaction during playback
            />
           </div>
        </CardContent>
      </Card>
    </main>
  );
}

