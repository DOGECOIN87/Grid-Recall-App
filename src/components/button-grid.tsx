"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ButtonGridProps {
  rows: number;
  cols: number;
  sequence: number[];
  currentStep: number;
  onButtonClick: (index: number) => void;
}

export function ButtonGrid({ rows, cols, sequence, currentStep, onButtonClick }: ButtonGridProps) {
  const gridItems = Array.from({ length: rows * cols }, (_, index) => index);

  const getButtonVariant = (index: number): 'default' | 'secondary' | 'outline' => {
    const sequenceIndex = sequence.findIndex((stepIndex, step) => step === index && step < currentStep);
    if (sequenceIndex !== -1 && sequenceIndex < currentStep) {
      return 'secondary'; // Pressed and part of the sequence up to the current step
    }
    if (sequence.includes(index)) {
       return 'outline'; // Pressed but after the current step
    }
    return 'default'; // Not pressed
  };

   const getSequenceNumber = (index: number): number | null => {
    const stepIndex = sequence.findIndex((step, i) => step === index && i < currentStep);
    return stepIndex !== -1 ? stepIndex + 1 : null;
  };


  return (
    <div
      className="grid gap-2 md:gap-3 justify-center"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        maxWidth: `${cols * 4}rem`, // Adjust max width based on columns
        margin: '0 auto', // Center the grid
      }}
    >
      {gridItems.map((index) => {
        const sequenceNumber = getSequenceNumber(index);
        const variant = getButtonVariant(index);
        const isCurrent = sequence[currentStep -1] === index && currentStep > 0;

        return (
          <Button
            key={index}
            variant={variant}
            className={cn(
              'relative aspect-square w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-xs md:text-sm font-semibold transition-colors duration-150 ease-in-out focus:ring-2 focus:ring-accent',
              variant === 'secondary' && 'bg-accent text-accent-foreground hover:bg-accent/90',
              isCurrent && 'ring-2 ring-offset-2 ring-accent', // Highlight current step button
              'flex items-center justify-center p-0' // Ensure content is centered
            )}
            onClick={() => onButtonClick(index)}
            aria-label={`Grid button ${index + 1}`}
          >
            {sequenceNumber !== null && (
              <span className="absolute top-0 right-0 px-1.5 py-0.5 bg-background text-foreground text-[10px] md:text-xs rounded-bl-md font-bold leading-none">
                {sequenceNumber}
              </span>
            )}
             {/* Keep button content empty for clean look, number is shown in corner */}
          </Button>
        );
      })}
    </div>
  );
}
