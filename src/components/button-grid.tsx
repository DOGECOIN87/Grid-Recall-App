
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

// Calculates the CSS style for placing a step number at a clock position (0-11)
// isOuter determines if the number should be in the inner (1-12) or outer (13+) ring.
const getClockPositionStyle = (positionIndex: number, isOuter: boolean): React.CSSProperties => {
  const angleDeg = (positionIndex * 30) - 90; // 0 degrees is right, -90 is top (12 o'clock)
  const angleRad = angleDeg * (Math.PI / 180);
  // Adjust radius based on inner/outer ring
  const radius = isOuter ? 58 : 40; // Percentage offset from center (e.g., 40% inner, 58% outer)

  // Calculate position relative to the button's center (50%, 50%)
  const top = 50 + radius * Math.sin(angleRad);
  const left = 50 + radius * Math.cos(angleRad);

  return {
    position: 'absolute',
    top: `${top}%`,
    left: `${left}%`,
    transform: 'translate(-50%, -50%)', // Center the number on the calculated point
    fontSize: '0.65rem', // Smaller font size for step numbers
    fontWeight: '500', // Medium weight
    pointerEvents: 'none', // Prevent numbers from interfering with button clicks
    lineHeight: '1', // Ensure consistent line height
    textAlign: 'center',
  };
};


export function ButtonGrid({ rows, cols, sequence, currentStep, onButtonClick }: ButtonGridProps) {
  const gridItems = Array.from({ length: rows * cols }, (_, index) => index);

  const getButtonVariant = (index: number): 'default' | 'secondary' | 'outline' => {
    const pressedBefore = sequence.slice(0, currentStep).includes(index);
    const pressedAfter = sequence.slice(currentStep).includes(index);

    if (pressedBefore) {
      return 'secondary'; // Highlight buttons pressed up to the current step
    }
    if (pressedAfter) {
      // Keep future steps visible but distinct
      return 'outline'; // Or another variant like 'ghost' if preferred
    }
    // Default state for unpressed buttons
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
          const innerSequenceNumbers = allSequenceNumbers.filter(n => n <= 12);
          const outerSequenceNumbers = allSequenceNumbers.filter(n => n > 12);

          const variant = getButtonVariant(index);
          const isCurrent = sequence[currentStep - 1] === index && currentStep > 0;
          const sequenceString = allSequenceNumbers.join(', ');

          // Map to store final calculated positions for each step number on this button
          // Key: positionIndex (0-11), Value: stepNumber
          const occupiedInnerPositions = new Map<number, number>();
          const occupiedOuterPositions = new Map<number, number>();

          // Function to handle position finding and conflict resolution
          const findPosition = (stepNumber: number, occupiedPositions: Map<number, number>) => {
             const initialPositionIndex = (stepNumber - 1) % 12; // Calculate initial target position (0-11)
             let finalPositionIndex = initialPositionIndex;
             let attempts = 0;

             // Find the next available position clockwise if the initial one is taken
             while (occupiedPositions.has(finalPositionIndex) && attempts < 12) {
               finalPositionIndex = (finalPositionIndex + 1) % 12;
               attempts++;
             }

              // If a spot is found (or the initial was free), mark it as occupied by this stepNumber
              if (attempts < 12) {
                  occupiedPositions.set(finalPositionIndex, stepNumber);
              } else {
                  // Fallback: If all 12 slots are filled
                  console.warn(`Button ${index}, Step ${stepNumber}: Could not find an empty slot after 12 attempts. Overwriting last found position.`);
                  // Place it in the last checked slot (which might overwrite)
                  occupiedPositions.set(finalPositionIndex, stepNumber);
              }
          };

          // Calculate positions for INNER sequence numbers (1-12)
          innerSequenceNumbers.forEach(stepNumber => {
            findPosition(stepNumber, occupiedInnerPositions);
          });

          // Calculate positions for OUTER sequence numbers (>12)
          outerSequenceNumbers.forEach(stepNumber => {
             findPosition(stepNumber, occupiedOuterPositions);
          });


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
                  {/* Render Inner Step Numbers */}
                  {Array.from(occupiedInnerPositions.entries()).map(([positionIndex, stepNumber]) => (
                     <span
                        key={`${index}-inner-step-${stepNumber}`}
                        className={cn(
                          "absolute pointer-events-none",
                           // Inner colors: Accent foreground when pressed, default foreground otherwise
                           variant === 'secondary' ? 'text-accent-foreground/80' : 'text-foreground/70'
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
                          "absolute pointer-events-none",
                           // Outer colors (inverted): Default foreground when pressed, accent color otherwise
                           variant === 'secondary' ? 'text-foreground/90' : 'text-accent'
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
