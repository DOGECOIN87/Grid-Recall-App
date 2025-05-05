
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

  // Gets all sequence numbers (step numbers) for a specific button index up to the current step
  const getSequenceNumbers = (index: number): number[] => {
    const numbers: number[] = [];
    for (let i = 0; i < currentStep; i++) {
      if (sequence[i] === index) {
        numbers.push(i + 1); // Step numbers are 1-based
      }
    }
    return numbers;
  };

  // Calculates the CSS style for placing a step number at a clock position (1-12)
  // positionIndex: 0 for 12 o'clock, 1 for 1 o'clock, ..., 11 for 11 o'clock
  const getClockPositionStyle = (positionIndex: number): React.CSSProperties => {
    const angleDeg = (positionIndex * 30) - 90; // 0 degrees is right, -90 is top (12 o'clock)
    const angleRad = angleDeg * (Math.PI / 180);
    const radius = 40; // Percentage offset from center (adjust for desired distance)

    const top = 50 + radius * Math.sin(angleRad);
    const left = 50 + radius * Math.cos(angleRad);

    return {
      position: 'absolute',
      top: `${top}%`,
      left: `${left}%`,
      transform: 'translate(-50%, -50%)', // Center the number on the calculated point
    };
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
          const allSequenceNumbers = getSequenceNumbers(index); // All steps for this button up to currentStep
          const latestTwelveSequenceNumbers = allSequenceNumbers.slice(-12); // Get the last 12 steps
          const variant = getButtonVariant(index);
          const isCurrent = sequence[currentStep - 1] === index && currentStep > 0;
          const sequenceString = allSequenceNumbers.join(', ');

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
                  aria-label={`Grid button ${index + 1}${allSequenceNumbers.length > 0 ? `, pressed at steps ${sequenceString}` : ''}`}
                >
                  {/* Display Latest 12 Step Numbers in Clock Positions */}
                  {latestTwelveSequenceNumbers.map((stepNumber) => {
                    const positionIndex = (stepNumber - 1) % 12; // 0-11 (step 1 -> 0, step 12 -> 11, step 13 -> 0)
                    return (
                      <span
                        key={`${index}-step-${stepNumber}`} // Unique key per step number on this button
                        className={cn(
                          "absolute text-xs font-medium pointer-events-none", // Smaller font for step numbers
                          variant === 'secondary' ? 'text-accent-foreground/80' : 'text-foreground/70' // Slightly dimmer
                        )}
                        style={getClockPositionStyle(positionIndex)}
                        aria-hidden="true" // Hide from screen readers
                      >
                        {stepNumber}
                      </span>
                    );
                  })}
                </Button>
              </TooltipTrigger>
              {allSequenceNumbers.length > 0 && (
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

