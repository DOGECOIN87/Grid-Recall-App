"use client";

import React, { useState, useEffect } from 'react';
import { GridConfigurator } from '@/components/grid-configurator';
import { ButtonGrid } from '@/components/button-grid';
import { StepIndicator } from '@/components/step-indicator';
import { Button } from '@/components/ui/button';
import { RotateCcw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

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
    // Render nothing or a loading indicator on the server
    return null;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 lg:p-12 bg-background text-foreground">
      <Card className="w-full max-w-3xl shadow-lg rounded-lg">
        <CardHeader className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 pb-4">
          <CardTitle className="text-2xl md:text-3xl font-bold">GridRecall</CardTitle>
          <div className="flex flex-col sm:flex-row items-center gap-4">
             {/* Grid Configurator moved here */}
            <GridConfigurator gridSize={gridSize} onGridSizeChange={handleGridSizeChange} />
            <Button onClick={handleReset} variant="outline" size="icon" aria-label="Reset Sequence">
              <RotateCcw className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-10">
          {/* GridConfigurator removed from here */}
          <ButtonGrid
            rows={rows}
            cols={cols}
            sequence={sequence}
            currentStep={currentStep}
            onButtonClick={handleButtonClick}
          />
          <StepIndicator
            currentStep={currentStep}
            totalSteps={sequence.length}
            onPrevious={handlePreviousStep}
            onNext={handleNextStep}
            isSequenceEmpty={sequence.length === 0}
          />
        </CardContent>
      </Card>
    </main>
  );
}
