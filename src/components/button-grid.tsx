
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
  disabled?: boolean; // Add disabled prop
}

// Calculates the CSS style for placing a step number at a clock position (0-11)
const getClockPositionStyle = (positionIndex: number, isOuter: boolean): React.CSSProperties => {
  const angleDeg = (positionIndex * 30) - 90; // 0 degrees is right, -90 is top (12 o'clock)
  const angleRad = angleDeg * (Math.PI / 180);
  const radius = isOuter ? 58 : 40; // Percentage offset: 40% inner, 58% outer

  const top = 50 + radius * Math.sin(angleRad);
  const left = 50 + radius * Math.cos(angleRad);

  return {
    position: 'absolute',
    top: `${top}%`,
    left: `${left}%`,
    transform: 'translate(-50%, -50%)', // Center the number
    fontSize: '0.65rem',
    fontWeight: '500',
    pointerEvents: 'none',
    lineHeight: '1',
    textAlign: 'center',
    zIndex: 1,
  };
};


export function ButtonGrid({ rows, cols, sequence, currentStep, onButtonClick, disabled = false }: ButtonGridProps) {
  const gridItems = Array.from({ length: rows * cols }, (_, index) => index);

  const getButtonVariant = (index: number): 'default' | 'secondary' | 'outline' => {
    const pressedBefore = sequence.slice(0, currentStep).includes(index);
    const pressedAfter = sequence.slice(currentStep).includes(index);

    if (pressedBefore) return 'secondary';
    if (pressedAfter) return 'outline';
    return 'default';
  };

  const getSequenceNumbers = (index: number): number[] => {
    const numbers: number[] = [];
    for (let i = 0; i < currentStep; i++) {
      if (sequence[i] === index) {
        numbers.push(i + 1); // 1-based step numbers
      }
    }
    return numbers;
  };


  return (
    <TooltipProvider>
      <div
        className="grid gap-4 md:gap-5 lg:gap-6"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {gridItems.map((index) => {
          const allSequenceNumbers = getSequenceNumbers(index);
          const innerSequenceNumbers = allSequenceNumbers.filter(n => n <= 12);
          const outerSequenceNumbers = allSequenceNumbers.filter(n => n > 12);

          const variant = getButtonVariant(index);
          const isCurrent = sequence[currentStep - 1] === index && currentStep > 0;
          const sequenceString = allSequenceNumbers.join(', ');

          const occupiedInnerPositions = new Map<number, number>();
          const occupiedOuterPositions = new Map<number, number>();

          const findPosition = (stepNumber: number, occupiedPositions: Map<number, number>) => {
             const initialPositionIndex = (stepNumber - 1) % 12;
             let finalPositionIndex = initialPositionIndex;
             let attempts = 0;

             while (occupiedPositions.has(finalPositionIndex) && attempts < 12) {
               finalPositionIndex = (finalPositionIndex + 1) % 12;
               attempts++;
             }

              if (attempts < 12) {
                  occupiedPositions.set(finalPositionIndex, stepNumber);
              } else {
                  // Fallback: If all 12 slots are filled (e.g., inner ring)
                  // Place it in the last checked slot (might overwrite, though unlikely with 2 rings)
                  occupiedPositions.set(finalPositionIndex, stepNumber);
              }
          };

          innerSequenceNumbers.forEach(stepNumber => {
            findPosition(stepNumber, occupiedInnerPositions);
          });

          outerSequenceNumbers.forEach(stepNumber => {
             findPosition(stepNumber, occupiedOuterPositions);
          });


          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  variant={variant}
                  className={cn(
                    'relative aspect-square w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full text-lg font-semibold transition-all duration-150 ease-in-out focus:ring-4 focus:ring-ring focus:ring-offset-2',
                    'flex items-center justify-center p-1 overflow-visible',
                    variant === 'secondary' && 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-md',
                    variant === 'outline' && 'border-border/50 text-muted-foreground bg-transparent hover:bg-muted/50',
                    variant === 'default' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
                    isCurrent && 'ring-4 ring-offset-2 ring-ring/80 shadow-lg scale-105',
                    'active:scale-95',
                    disabled && 'opacity-70 cursor-not-allowed pointer-events-none' // Style for disabled state
                  )}
                  onClick={() => onButtonClick(index)}
                  aria-label={`Grid button ${index + 1}${allSequenceNumbers.length > 0 ? `, pressed at steps ${sequenceString}` : ''}`}
                  disabled={disabled} // Apply disabled prop
                >
                  {/* Render Inner Step Numbers */}
                  {Array.from(occupiedInnerPositions.entries()).map(([positionIndex, stepNumber]) => (
                     <span
                        key={`${index}-inner-step-${stepNumber}`}
                        className={cn(
                          "absolute pointer-events-none rounded-full bg-background/10 backdrop-blur-sm px-1 py-0.5",
                           variant === 'secondary' ? 'text-accent-foreground/90' : 'text-foreground/80'
                        )}
                        style={getClockPositionStyle(positionIndex, false)} // isOuter = false
                        aria-hidden="true"
                      >
                        {stepNumber}
                      </span>
                  ))}
                   {/* Render Outer Step Numbers */}
                   {Array.from(occupiedOuterPositions.entries()).map(([positionIndex, stepNumber]) => (
                     <span
                        key={`${index}-outer-step-${stepNumber}`}
                        className={cn(
                          "absolute pointer-events-none rounded-full bg-background/10 backdrop-blur-sm px-1 py-0.5",
                           variant === 'secondary' ? 'text-foreground/90' : 'text-accent/90 font-bold'
                        )}
                        style={getClockPositionStyle(positionIndex, true)} // isOuter = true
                        aria-hidden="true"
                      >
                        {stepNumber}
                      </span>
                  ))}
                </Button>
              </TooltipTrigger>
              {allSequenceNumbers.length > 0 && (
                <TooltipContent side="bottom" className="bg-popover text-popover-foreground rounded-md shadow-lg">
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
