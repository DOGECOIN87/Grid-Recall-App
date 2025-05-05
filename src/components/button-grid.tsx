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

  // Finds the step number (1-based) of the last time this button was pressed within the current view
   const getLastSequenceNumber = (index: number): number | null => {
    let lastIndex = -1;
    // Iterate up to currentStep to find the last occurrence
    for (let i = 0; i < currentStep; i++) {
      if (sequence[i] === index) {
        lastIndex = i;
      }
    }
    // Return 1-based step number if found
    return lastIndex !== -1 ? lastIndex + 1 : null;
  };


  return (
    <div
      className="grid gap-2 md:gap-3 justify-center"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        maxWidth: `${cols * 4.5}rem`, // Slightly increased max width for better spacing
        margin: '0 auto',
      }}
    >
      {gridItems.map((index) => {
        const lastSequenceNumber = getLastSequenceNumber(index);
        const variant = getButtonVariant(index);
        // isCurrent highlights the button corresponding exactly to the current step being viewed
        const isCurrent = sequence[currentStep - 1] === index && currentStep > 0;

        return (
          <Button
            key={index}
            variant={variant}
            className={cn(
              'relative aspect-square w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-xs md:text-sm font-semibold transition-colors duration-150 ease-in-out focus:ring-2 focus:ring-ring', // Use ring color from theme
              variant === 'secondary' && 'bg-accent text-accent-foreground hover:bg-accent/90',
              // Highlight the button corresponding to the *exact* step being viewed (currentStep - 1)
              isCurrent && 'ring-2 ring-offset-2 ring-ring',
              'flex items-center justify-center p-0' // Ensure content is centered
            )}
            onClick={() => onButtonClick(index)}
            aria-label={`Grid button ${index + 1}${lastSequenceNumber ? `, last pressed at step ${lastSequenceNumber}` : ''}`}
          >
            {lastSequenceNumber !== null && (
              // Display the last step number this button was pressed (within current view)
              <span className="absolute top-0 right-0 px-1.5 py-0.5 bg-background text-foreground text-[10px] md:text-xs rounded-bl-md font-bold leading-none shadow-sm"> {/* Added subtle shadow */}
                {lastSequenceNumber}
              </span>
            )}
             {/* Button content is kept empty for a clean look */}
          </Button>
        );
      })}
    </div>
  );
}
