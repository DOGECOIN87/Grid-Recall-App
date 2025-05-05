"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'; // Import Tooltip components
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


  return (
    <TooltipProvider>
      <div
        className="grid gap-2 md:gap-3 justify-center"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          maxWidth: `${cols * 4.5}rem`, // Slightly increased max width for better spacing
          margin: '0 auto',
        }}
      >
        {gridItems.map((index) => {
          const sequenceNumbers = getSequenceNumbers(index);
          const variant = getButtonVariant(index);
          // isCurrent highlights the button corresponding exactly to the current step being viewed
          const isCurrent = sequence[currentStep - 1] === index && currentStep > 0;
          const sequenceString = sequenceNumbers.join(', ');
          // Determine if the string is too long to display directly
          const displayLimit = 5; // Adjust limit as needed based on button size and font
          const truncatedString = sequenceNumbers.length > displayLimit
            ? `${sequenceNumbers.slice(0, displayLimit).join(', ')}...`
            : sequenceString;


          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  variant={variant}
                  className={cn(
                    'relative aspect-square w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-xs md:text-sm font-semibold transition-colors duration-150 ease-in-out focus:ring-2 focus:ring-ring', // Use ring color from theme
                    variant === 'secondary' && 'bg-accent text-accent-foreground hover:bg-accent/90',
                    // Highlight the button corresponding to the *exact* step being viewed (currentStep - 1)
                    isCurrent && 'ring-2 ring-offset-2 ring-ring',
                    'flex items-center justify-center p-1' // Reduced padding to make space
                  )}
                  onClick={() => onButtonClick(index)}
                  aria-label={`Grid button ${index + 1}${sequenceNumbers.length > 0 ? `, pressed at steps ${sequenceString}` : ''}`}
                >
                  {sequenceNumbers.length > 0 && (
                    // Display the sequence numbers (potentially truncated)
                    <span
                      className={cn(
                        "absolute inset-0 flex items-center justify-center text-[10px] md:text-[11px] lg:text-xs font-bold leading-tight text-center p-0.5 overflow-hidden", // Adjusted sizes and padding
                        variant === 'secondary' ? 'text-accent-foreground' : 'text-foreground/80' // Adjust text color based on variant
                      )}
                      // Add title attribute for full list on hover (fallback if tooltip fails)
                      title={sequenceNumbers.length > displayLimit ? sequenceString : undefined}
                    >
                      {truncatedString}
                    </span>
                  )}
                   {/* Button content area */}
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
