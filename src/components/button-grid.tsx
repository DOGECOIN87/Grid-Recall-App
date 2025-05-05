
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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

  // Determines the visual style of the button based on its state in the sequence view
  const getButtonVariant = (index: number): 'default' | 'secondary' | 'outline' => {
    const pressedBefore = sequence.slice(0, currentStep).includes(index);
    const pressedAfter = sequence.slice(currentStep).includes(index);

    if (pressedBefore) {
      return 'secondary'; // If pressed before (or at) current step, it's secondary
    }
    if (pressedAfter) {
      return 'outline'; // If not pressed before, but pressed after, it's outline (visible when stepping back)
    }
    return 'default'; // Otherwise, default
  };

  // Finds all step numbers (1-based) where this button was pressed within the current view
  const getSequenceNumbers = (index: number): number[] => {
    const numbers: number[] = [];
    // Iterate up to currentStep to find all occurrences
    for (let i = 0; i < currentStep; i++) {
      if (sequence[i] === index) {
        numbers.push(i + 1); // Store 1-based step number
      }
    }
    return numbers;
  };

  // Calculates the total count of presses for the button up to the current step
   const getPressCount = (index: number): number => {
    return sequence.slice(0, currentStep).filter(stepIndex => stepIndex === index).length;
  };


  return (
    <TooltipProvider>
      <div
        className="grid gap-3 md:gap-4 justify-center" // Increased gap
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          // Adjusted max width based on larger button size (lg:w-24 is 6rem) + gap (lg:gap-4 is 1rem) = ~7rem per column
          maxWidth: `${cols * 7}rem`,
          margin: '0 auto',
        }}
      >
        {gridItems.map((index) => {
          const sequenceNumbers = getSequenceNumbers(index);
          const pressCount = getPressCount(index);
          const variant = getButtonVariant(index);
          // isCurrent highlights the button corresponding exactly to the current step being viewed
          const isCurrent = sequence[currentStep - 1] === index && currentStep > 0;
          const sequenceString = sequenceNumbers.join(', ');

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  variant={variant}
                  className={cn(
                    'relative aspect-square w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-full text-base md:text-lg font-semibold transition-colors duration-150 ease-in-out focus:ring-2 focus:ring-ring', // Increased size, updated text size
                    variant === 'secondary' && 'bg-accent text-accent-foreground hover:bg-accent/90',
                    isCurrent && 'ring-2 ring-offset-2 ring-ring',
                    'flex items-center justify-center p-1 overflow-hidden' // Ensure content is centered
                  )}
                  onClick={() => onButtonClick(index)}
                  aria-label={`Grid button ${index + 1}${sequenceNumbers.length > 0 ? `, pressed at steps ${sequenceString}` : ''}`}
                >
                  {/* Display Press Count in the center */}
                  {pressCount > 0 && (
                    <span
                      className={cn(
                        "absolute inset-0 flex items-center justify-center text-sm md:text-base lg:text-lg font-bold pointer-events-none", // Adjusted text size for count
                         variant === 'secondary' ? 'text-accent-foreground' : 'text-foreground/90'
                      )}
                    >
                      {pressCount}
                    </span>
                  )}
                </Button>
              </TooltipTrigger>
              {sequenceNumbers.length > 0 && (
                <TooltipContent>
                  <p>Pressed at steps: {sequenceString}</p>
                </TooltipContent>
              )}
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}
