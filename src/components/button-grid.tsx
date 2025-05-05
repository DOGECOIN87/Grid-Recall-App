
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

  const getButtonVariant = (index: number): 'default' | 'secondary' | 'outline' => {
    const pressedBefore = sequence.slice(0, currentStep).includes(index);
    const pressedAfter = sequence.slice(currentStep).includes(index);

    if (pressedBefore) {
      return 'secondary';
    }
    if (pressedAfter) {
      return 'outline';
    }
    return 'default';
  };

  const getSequenceNumbers = (index: number): number[] => {
    const numbers: number[] = [];
    for (let i = 0; i < currentStep; i++) {
      if (sequence[i] === index) {
        numbers.push(i + 1);
      }
    }
    return numbers;
  };

  const getPressCount = (index: number): number => {
    return sequence.slice(0, currentStep).filter(stepIndex => stepIndex === index).length;
  };

  // Defines positions for the last 4 step numbers: Top, Right, Bottom, Left
   const getStepPositionStyle = (placementIndex: number): React.CSSProperties => {
    // placementIndex: 0 for top, 1 for right, 2 for bottom, 3 for left
    const styles: React.CSSProperties[] = [
      { top: '8%', left: '50%', transform: 'translateX(-50%)' }, // Top-Center
      { top: '50%', right: '8%', transform: 'translateY(-50%)' }, // Mid-Right
      { bottom: '8%', left: '50%', transform: 'translateX(-50%)' }, // Bottom-Center
      { top: '50%', left: '8%', transform: 'translateY(-50%)' }, // Mid-Left
    ];
    // Ensure index wraps correctly for the 4 positions
    return styles[placementIndex % 4] || {};
  };


  return (
    <TooltipProvider>
      <div
        className="grid gap-4 md:gap-5 lg:gap-6 justify-center" // Increased gap slightly
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          // Adjusted max width based on larger button size (approx 8rem) + gap (approx 1.5rem) = ~9.5rem per column
          maxWidth: `${cols * 9.5}rem`,
          margin: '0 auto',
        }}
      >
        {gridItems.map((index) => {
          const pressCount = getPressCount(index);
          const sequenceNumbers = getSequenceNumbers(index); // All steps for this button up to currentStep
          const latestFourSequenceNumbers = sequenceNumbers.slice(-4); // Get the last 4 steps
          const variant = getButtonVariant(index);
          const isCurrent = sequence[currentStep - 1] === index && currentStep > 0;
          const sequenceString = sequenceNumbers.join(', ');

          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  variant={variant}
                  className={cn(
                    'relative aspect-square w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full text-base md:text-lg font-semibold transition-colors duration-150 ease-in-out focus:ring-2 focus:ring-ring', // Increased size again
                    variant === 'secondary' && 'bg-accent text-accent-foreground hover:bg-accent/90',
                    isCurrent && 'ring-2 ring-offset-2 ring-ring',
                    'flex items-center justify-center p-1 overflow-visible' // Use overflow-visible to allow numbers outside boundary slightly
                  )}
                  onClick={() => onButtonClick(index)}
                  aria-label={`Grid button ${index + 1}${sequenceNumbers.length > 0 ? `, pressed at steps ${sequenceString}` : ''}`}
                >
                  {/* Display Total Press Count in the center */}
                  {pressCount > 0 && (
                    <span
                      className={cn(
                        "absolute inset-0 flex items-center justify-center text-2xl md:text-3xl lg:text-4xl font-bold pointer-events-none z-10", // Made count much larger
                         variant === 'secondary' ? 'text-accent-foreground' : 'text-foreground/90'
                      )}
                    >
                      {pressCount}
                    </span>
                  )}

                  {/* Display Latest 4 Step Numbers (Clockwise: Top, Right, Bottom, Left) */}
                  {latestFourSequenceNumbers.map((stepNumber, idx) => (
                    <span
                      key={`${index}-${stepNumber}-${idx}`} // More robust key
                      className={cn(
                        "absolute text-xs md:text-sm font-medium pointer-events-none", // Kept step numbers smaller
                         variant === 'secondary' ? 'text-accent-foreground/80' : 'text-foreground/70' // Slightly dimmer
                      )}
                      style={getStepPositionStyle(idx)} // idx will be 0, 1, 2, 3
                    >
                      {stepNumber}
                    </span>
                  ))}
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
