
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
    fontSize: isOuter ? '0.7rem' : '0.65rem', // Outer numbers slightly larger
    fontWeight: isOuter ? '700' : '600', // Outer numbers bolder, inner regular bold
    pointerEvents: 'none',
    lineHeight: '1',
    textAlign: 'center',
    zIndex: 1, // Ensure numbers are above button base
    minWidth: '1.1rem', // Ensure minimum width for single digits
    padding: '0.1rem 0.15rem', // Fine-tune padding
  };
};


export function ButtonGrid({ rows, cols, sequence, currentStep, onButtonClick, disabled = false }: ButtonGridProps) {
  const gridItems = Array.from({ length: rows * cols }, (_, index) => index);

  const getButtonVariant = (index: number): 'default' | 'secondary' | 'outline' => {
    const pressedBefore = sequence.slice(0, currentStep).includes(index);
    const pressedAfter = sequence.slice(currentStep).includes(index);

    if (pressedBefore) return 'secondary'; // Use secondary (accent color) for steps already passed
    if (pressedAfter) return 'outline'; // Use outline for steps yet to come in playback/review
    return 'default'; // Default appearance
  };

  // Get all step numbers (1-based) for a given button index up to the current step
  const getAllSequenceNumbersForButton = (buttonIndex: number): number[] => {
    const numbers: number[] = [];
    for (let i = 0; i < sequence.length; i++) { // Iterate through the *entire* sequence
      if (sequence[i] === buttonIndex) {
        numbers.push(i + 1); // 1-based step numbers
      }
    }
    return numbers;
  };

  // Get step numbers (1-based) for a given button index ONLY up to the current display step
  const getVisibleSequenceNumbersForButton = (buttonIndex: number): number[] => {
    const numbers: number[] = [];
    for (let i = 0; i < currentStep; i++) { // Iterate only up to currentStep
      if (sequence[i] === buttonIndex) {
        numbers.push(i + 1); // 1-based step numbers
      }
    }
    return numbers;
  };


  return (
    <TooltipProvider>
      <div
        className="grid gap-6 md:gap-7 lg:gap-8" // Increased gap for more space
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
          gridAutoRows: 'minmax(0, 1fr)', // Ensure rows also take up equal space
        }}
        aria-label={`Button Grid ${rows}x${cols}`}
      >
        {gridItems.map((index) => {
          const visibleSequenceNumbers = getVisibleSequenceNumbersForButton(index);
          const allSequenceNumbers = getAllSequenceNumbersForButton(index); // For tooltip

          const innerSequenceNumbers = visibleSequenceNumbers.filter(n => n <= 12);
          const outerSequenceNumbers = visibleSequenceNumbers.filter(n => n > 12);

          const variant = getButtonVariant(index);
          // Highlight the button if it's the very last step shown
          const isCurrentStepButton = sequence[currentStep - 1] === index && currentStep > 0;
          const sequenceString = allSequenceNumbers.join(', ');

          // Maps to store occupied clock positions to avoid overlap
          const occupiedInnerPositions = new Map<number, number>(); // positionIndex -> stepNumber
          const occupiedOuterPositions = new Map<number, number>(); // positionIndex -> stepNumber

          // Function to find the next available clock position (0-11)
          const findPosition = (stepNumber: number, occupiedPositions: Map<number, number>) => {
             const initialPositionIndex = (stepNumber - 1) % 12;
             let finalPositionIndex = initialPositionIndex;
             let attempts = 0;

             // Find the next empty slot clockwise
             while (occupiedPositions.has(finalPositionIndex) && attempts < 12) {
               finalPositionIndex = (finalPositionIndex + 1) % 12;
               attempts++;
             }

              // Place the number in the found slot (or overwrite if full, though unlikely with 2 rings)
              occupiedPositions.set(finalPositionIndex, stepNumber);
          };

          // Assign positions for inner numbers
          innerSequenceNumbers.forEach(stepNumber => {
            findPosition(stepNumber, occupiedInnerPositions);
          });

          // Assign positions for outer numbers
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
                    'flex items-center justify-center p-1 overflow-visible shadow-md', // Added shadow-md
                    // Style based on whether the step has passed or not
                    variant === 'secondary' && 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg', // Passed steps
                    variant === 'outline' && 'border-border/50 text-muted-foreground bg-transparent hover:bg-muted/50', // Future steps in review
                    variant === 'default' && 'bg-secondary text-secondary-foreground hover:bg-secondary/80', // Default/unused
                    // Highlight the button corresponding to the current step number being shown
                    isCurrentStepButton && 'ring-4 ring-offset-2 ring-ring/80 shadow-xl scale-105 border-2 border-primary', // Make current step pop
                    'active:scale-95',
                    disabled && 'opacity-70 cursor-not-allowed pointer-events-none shadow-inner' // Style for disabled state
                  )}
                  onClick={() => !disabled && onButtonClick(index)} // Only allow click if not disabled
                  aria-label={`Grid button ${index + 1}${allSequenceNumbers.length > 0 ? `, pressed at steps ${sequenceString}` : ''}`}
                  disabled={disabled} // Apply disabled prop
                  aria-pressed={visibleSequenceNumbers.length > 0} // Indicate if pressed in the current view
                >
                  {/* Render Inner Step Numbers (1-12) */}
                  {Array.from(occupiedInnerPositions.entries()).map(([positionIndex, stepNumber]) => (
                     <span
                        key={`${index}-inner-step-${stepNumber}`}
                        className={cn(
                          "absolute pointer-events-none rounded-full bg-background/30 backdrop-blur-sm px-1 py-0.5", // Slightly more visible background
                           variant === 'secondary' ? 'text-accent-foreground/90' : 'text-foreground/80', // Adjust text color based on button state
                           stepNumber > 9 ? 'ring-1 ring-inset ring-primary/30' : '', // Subtle ring for double digits inner
                           stepNumber > 12 ? 'font-bold' : '' // Bolder for >12 (though this is inner ring)
                        )}
                        style={getClockPositionStyle(positionIndex, false)} // isOuter = false
                        aria-hidden="true"
                      >
                        {stepNumber}
                      </span>
                  ))}
                   {/* Render Outer Step Numbers (>12) */}
                   {Array.from(occupiedOuterPositions.entries()).map(([positionIndex, stepNumber]) => (
                     <span
                        key={`${index}-outer-step-${stepNumber}`}
                        className={cn(
                          "absolute pointer-events-none rounded-full bg-muted/70 backdrop-blur-md px-1.5 py-1 ring-2 ring-inset ring-primary/60 shadow-md", // More distinct background + ring + shadow for outer
                           variant === 'secondary' ? 'text-foreground font-semibold' : 'text-primary font-bold', // Bolder text for outer, ensure contrast
                           stepNumber > 19 ? 'ring-accent ring-offset-1 ring-offset-background' : '', // Stronger ring for > 19
                           stepNumber > 24 ? 'bg-destructive/20 text-destructive-foreground' : '' // Very high numbers with destructive theme
                        )}
                        style={getClockPositionStyle(positionIndex, true)} // isOuter = true
                        aria-hidden="true"
                      >
                        {stepNumber}
                      </span>
                  ))}
                </Button>
              </TooltipTrigger>
              {/* Tooltip shows *all* steps the button was pressed in, regardless of currentStep */}
              {allSequenceNumbers.length > 0 && (
                <TooltipContent side="bottom" className="bg-popover text-popover-foreground rounded-md shadow-lg border border-border/50">
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

