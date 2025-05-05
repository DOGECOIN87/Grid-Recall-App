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

  // Defines the position class for each sequence number (up to 5)
  const getPositionClass = (order: number): string => {
    switch (order) {
      case 0: return 'top-0 left-0'; // Top-left
      case 1: return 'top-0 right-0'; // Top-right
      case 2: return 'bottom-0 right-0'; // Bottom-right
      case 3: return 'bottom-0 left-0'; // Bottom-left
      case 4: return 'inset-0 flex items-center justify-center'; // Center
      default: return 'hidden'; // Hide if more than 5
    }
  };

  return (
    <TooltipProvider>
      <div
        className="grid gap-2 md:gap-3 justify-center"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          maxWidth: `${cols * 4.5}rem`,
          margin: '0 auto',
        }}
      >
        {gridItems.map((index) => {
          const sequenceNumbers = getSequenceNumbers(index);
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
                    'relative aspect-square w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 text-xs md:text-sm font-semibold transition-colors duration-150 ease-in-out focus:ring-2 focus:ring-ring',
                    variant === 'secondary' && 'bg-accent text-accent-foreground hover:bg-accent/90',
                    isCurrent && 'ring-2 ring-offset-2 ring-ring',
                    'flex items-center justify-center p-1 overflow-hidden' // Added overflow-hidden
                  )}
                  onClick={() => onButtonClick(index)}
                  aria-label={`Grid button ${index + 1}${sequenceNumbers.length > 0 ? `, pressed at steps ${sequenceString}` : ''}`}
                >
                  {/* Positioned Sequence Numbers */}
                  {sequenceNumbers.slice(0, 5).map((num, order) => (
                    <span
                      key={order}
                      className={cn(
                        "absolute text-[9px] md:text-[10px] lg:text-[11px] font-bold leading-none p-0.5 pointer-events-none", // Smallest text size, no padding
                        getPositionClass(order),
                        variant === 'secondary' ? 'text-accent-foreground' : 'text-foreground/90' // Adjusted text color
                      )}
                      // Position specific adjustments
                      style={{
                        transform: order === 4 ? 'translateY(-1px)' : '', // Slight adjustment for center
                        // Add small padding/margin to avoid corner overlap if needed
                        margin: order < 4 ? '1px' : ''
                      }}
                    >
                      {num}
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
