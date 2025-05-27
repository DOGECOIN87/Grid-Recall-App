
"use client";

import React, { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { ButtonGrid } from '@/components/button-grid';
import { StepIndicator } from '@/components/step-indicator';
import { PlaybackControls } from '@/components/playback-controls';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function Home() {
  const [sequence, setSequence] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [rows] = useState(3); // Default to 3x3 grid
  const [cols] = useState(3); // Default to 3x3 grid
  const [isClient, setIsClient] = useState(false);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackStep, setPlaybackStep] = useState<number>(0);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);
    // Initialize or reset based on fixed 3x3 grid
    setSequence([]);
    setCurrentStep(0);
    setIsPlaying(false);
    setPlaybackStep(0);
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
      playbackIntervalRef.current = null;
    }
  }, []); // Runs once on mount

  useEffect(() => {
    if (isPlaying) {
      playbackIntervalRef.current = setInterval(() => {
        setPlaybackStep((prev) => {
          const nextStep = prev + 1;
          if (nextStep <= sequence.length) {
             setCurrentStep(nextStep);
            return nextStep;
          } else {
            setIsPlaying(false);
            if (playbackIntervalRef.current) {
              clearInterval(playbackIntervalRef.current);
              playbackIntervalRef.current = null;
            }
            setCurrentStep(sequence.length); 
            return sequence.length; 
          }
        });
      }, 800); 
    } else {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
        playbackIntervalRef.current = null;
      }
      setCurrentStep(playbackStep);
    }

    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, [isPlaying, sequence.length, playbackStep]);

  const handleButtonClick = (index: number) => {
    if (isPlaying) return; 
    setSequence((prevSequence) => {
      const newSequence = [...prevSequence, index];
      setCurrentStep(newSequence.length);
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
    if (isPlaying) return; 
    setPlaybackStep((prevStep) => Math.max(0, prevStep - 1));
  };

  const handleNextStep = () => {
    if (isPlaying) return; 
     setPlaybackStep((prevStep) => Math.min(sequence.length, prevStep + 1));
  };

 const handlePlay = useCallback(() => {
    if (sequence.length === 0) return;
    if (playbackStep >= sequence.length) { 
      setPlaybackStep(0);
      setCurrentStep(0); 
    }
    setIsPlaying(true);
  }, [sequence.length, playbackStep]);

  const handlePause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const handleStop = useCallback(() => {
    setIsPlaying(false);
    setPlaybackStep(0); 
    setCurrentStep(0);   
  }, []);


  if (!isClient) {
    return (
       <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-12 bg-background text-foreground">
         <Card className="w-full max-w-4xl shadow-2xl rounded-xl border-2 border-border/50 bg-card">
           <CardHeader className="flex flex-col items-center space-y-4 pb-6 pt-8 border-b border-border">
              <Image
                src="/logo.png" 
                alt="Follow the Bananas Logo"
                width={120} 
                height={120}
                className="rounded-full object-contain shadow-lg border-2 border-primary/50 mb-4"
                priority
              />
             <div className="text-center">
                <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight text-primary">Follow the Bananas</CardTitle>
                <CardDescription className="text-center text-muted-foreground mt-2">
                    Memorize sequences. Follow the bananas to victory!
                </CardDescription>
             </div>
           </CardHeader>
           <CardContent className="flex flex-col items-center justify-center space-y-12 py-10">
             <div className="text-muted-foreground animate-pulse text-lg">Loading Interface...</div>
           </CardContent>
         </Card>
       </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-12 bg-background text-foreground">
      <Card className="w-full max-w-4xl shadow-xl rounded-xl border border-border bg-card overflow-hidden">
        <CardHeader className="flex flex-col items-center space-y-5 pb-7 pt-8 border-b border-border">
          <div className="text-center relative">
            <div className="mb-4 flex justify-center">
              <Image
                src="/logo.png" 
                alt="Follow the Bananas Logo"
                width={150} 
                height={150} 
                className="object-contain" 
                priority
              />
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-12 p-6 md:p-8 lg:p-10 relative">
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 p-5 bg-background/30 rounded-xl border border-border relative">
            <div className="z-10">
              <Button 
                onClick={handleReset} 
                variant="destructive" 
                size="default" 
                aria-label="Reset Sequence"
                className="font-semibold shadow-lg hover:shadow-destructive/20 transition-all duration-300 rounded-full px-5 hover:-translate-y-1 hover:scale-105 active:scale-95"
              >
                <RotateCcw className="h-5 w-5 mr-2" /> Reset
              </Button>
            </div>

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
          
          <div className="mt-8 text-center text-sm text-muted-foreground bg-background/30 rounded-lg p-4 border border-border shadow-lg relative overflow-hidden">
            <p className="relative z-10 font-medium">
              Create a sequence by clicking buttons, then use playback controls to review your pattern. Follow the bananas!
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
