"use client";

import React, { useState, useEffect } from 'react';
import { GridConfigurator } from '@/components/grid-configurator';
import { ButtonGrid } from '@/components/button-grid';
import { StepIndicator } from '@/components/step-indicator';
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

  useEffect(() => {
    // Ensure this runs only on the client after hydration
    setIsClient(true);
    const [r, c] = gridSize.split('x').map(Number);
    setRows(r);
    setCols(c);
    // Reset sequence when grid size changes
    setSequence([]);
    setCurrentStep(0);
  }, [gridSize]);

  const handleGridSizeChange = (newSize: GridSize) => {
    setGridSize(newSize);
  };

  const handleButtonClick = (index: number) => {
    setSequence((prevSequence) => {
      const newSequence = [...prevSequence, index];
      // Set current step to the end of the sequence after adding a new step
      setCurrentStep(newSequence.length);
      return newSequence;
    });
  };


  const handleReset = () => {
    setSequence([]);
    setCurrentStep(0);
  };

  const handlePreviousStep = () => {
    setCurrentStep((prevStep) => Math.max(0, prevStep - 1));
  };

  const handleNextStep = () => {
    setCurrentStep((prevStep) => Math.min(sequence.length, prevStep + 1));
  };

  if (!isClient) {
    // Render a placeholder or loading state on the server to avoid hydration mismatch
    // Or simply return null if no server-side rendering is needed for this part
    return (
       <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-12 bg-background text-foreground">
         <Card className="w-full max-w-3xl shadow-xl rounded-xl border-2 border-border/50">
           <CardHeader className="flex flex-col items-center space-y-4 pb-6 pt-8">
             <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight">GridRecall</CardTitle>
             <CardDescription className="text-center text-muted-foreground">
               Memorize sequences visually. Click buttons to log steps, use controls to review.
             </CardDescription>
           </CardHeader>
           <CardContent className="flex flex-col items-center justify-center space-y-8 py-8">
             {/* Placeholder content or loading indicator */}
              <div className="text-muted-foreground">Loading...</div>
           </CardContent>
         </Card>
       </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-12 bg-background text-foreground">
      {/* Use a slightly larger shadow and border for better definition */}
      <Card className="w-full max-w-4xl shadow-xl rounded-xl border-2 border-border/50">
        <CardHeader className="flex flex-col items-center space-y-4 pb-6 pt-8">
          <CardTitle className="text-3xl md:text-4xl font-bold tracking-tight">GridRecall</CardTitle>
           <CardDescription className="text-center text-muted-foreground">
             Memorize sequences visually. Click buttons to log steps, use controls to review.
           </CardDescription>
        </CardHeader>
        <CardContent className="space-y-10 p-6 md:p-8 lg:p-10">
          {/* Control Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 p-4 bg-muted rounded-lg shadow-inner">
            <GridConfigurator gridSize={gridSize} onGridSizeChange={handleGridSizeChange} />
            <StepIndicator
              currentStep={currentStep}
              totalSteps={sequence.length}
              onPrevious={handlePreviousStep}
              onNext={handleNextStep}
              isSequenceEmpty={sequence.length === 0}
            />
            <Button onClick={handleReset} variant="destructive" size="default" aria-label="Reset Sequence">
              <RotateCcw className="h-5 w-5 mr-2" /> Reset
            </Button>
          </div>

          {/* Button Grid centered */}
          <div className="flex justify-center">
            <ButtonGrid
              rows={rows}
              cols={cols}
              sequence={sequence}
              currentStep={currentStep}
              onButtonClick={handleButtonClick}
            />
           </div>
        </CardContent>
      </Card>
    </main>
  );
}
