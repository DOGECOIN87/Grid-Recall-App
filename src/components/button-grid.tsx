
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
        className="grid gap-8 md:gap-9 lg:gap-10" // Increased gap significantly for more space
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
          const outerSequenceNumbers = visibleSequenceNumbers.filter(n => n > 12 && n <= 24); // Limit outer ring to 24 for now
          const thirdRingSequenceNumbers = visibleSequenceNumbers.filter(n => n > 24); // Numbers beyond 24

          const variant = getButtonVariant(index);
          // Highlight the button if it's the very last step shown
          const isCurrentStepButton = sequence[currentStep - 1] === index && currentStep > 0;
          const sequenceString = allSequenceNumbers.join(', ');

          // Maps to store occupied clock positions to avoid overlap for each ring
          const occupiedPositions = new Map<string, Map<number, number>>(); // ring -> positionIndex -> stepNumber
          occupiedPositions.set('inner', new Map<number, number>());
          occupiedPositions.set('outer', new Map<number, number>());
          occupiedPositions.set('third', new Map<number, number>());


          // Function to find the next available clock position (0-11) within a specific ring's map
          const findPosition = (stepNumber: number, occupiedRingPositions: Map<number, number>) => {
             const initialPositionIndex = (stepNumber - 1) % 12;
             let finalPositionIndex = initialPositionIndex;
             let attempts = 0;

             // Find the next empty slot clockwise
             while (occupiedRingPositions.has(finalPositionIndex) && attempts < 12) {
               finalPositionIndex = (finalPositionIndex + 1) % 12;
               attempts++;
             }

              // Place the number in the found slot (or overwrite if full)
              occupiedRingPositions.set(finalPositionIndex, stepNumber);
              return finalPositionIndex; // Return the determined position index
          };

          // Process and position numbers for each ring
          const positionedInnerNumbers = innerSequenceNumbers.map(stepNumber => ({
              stepNumber,
              positionIndex: findPosition(stepNumber, occupiedPositions.get('inner')!)
          }));
          const positionedOuterNumbers = outerSequenceNumbers.map(stepNumber => ({
              stepNumber,
              positionIndex: findPosition(stepNumber, occupiedPositions.get('outer')!)
          }));
          const positionedThirdRingNumbers = thirdRingSequenceNumbers.map(stepNumber => ({
              stepNumber,
              positionIndex: findPosition(stepNumber, occupiedPositions.get('third')!)
          }));


          return (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <Button
                  variant={variant}
                  className={cn(
                    'relative aspect-square w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-full text-lg font-semibold transition-all duration-300 ease-out',
                    'flex items-center justify-center p-1 overflow-visible shadow-lg', 
                    // Enhanced styling based on button state
                    variant === 'secondary' && 'bg-accent text-accent-foreground hover:bg-accent/90 shadow-xl button-glow', // Passed steps with glow
                    variant === 'outline' && 'border-white/20 text-muted-foreground bg-muted/10 backdrop-blur-sm hover:bg-muted/30 hover:border-white/30', // Future steps with glass effect
                    variant === 'default' && 'bg-secondary/80 text-secondary-foreground hover:bg-secondary/90 backdrop-blur-sm', // Default with glass effect
                    // Enhanced highlight for current step
                    isCurrentStepButton && 'ring-4 ring-offset-4 ring-accent/80 shadow-2xl scale-110 border-2 border-accent animate-pulse-slow', 
                    'hover:scale-105 active:scale-95 focus:ring-4 focus:ring-ring focus:ring-offset-2',
                    // Glass effect for all buttons
                    'before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-white/10 before:to-transparent before:opacity-50 before:pointer-events-none',
                    // Inner shadow for depth
                    'after:absolute after:inset-0 after:rounded-full after:shadow-inner after:pointer-events-none',
                    // Enhanced glow effect on hover
                    'hover:shadow-[0_0_15px_rgba(0,200,200,0.5)]',
                    // Improved active state
                    'active:shadow-[inset_0_0_10px_rgba(0,0,0,0.3)]',
                    disabled && 'opacity-70 cursor-not-allowed pointer-events-none shadow-inner filter grayscale' // Enhanced disabled state
                  )}
                  onClick={() => !disabled && onButtonClick(index)}
                  aria-label={`Grid button ${index + 1}${allSequenceNumbers.length > 0 ? `, pressed at steps ${sequenceString}` : ''}`}
                  disabled={disabled}
                  aria-pressed={visibleSequenceNumbers.length > 0}
                >
                  {/* Render Inner Step Numbers (1-12) */}
                  {positionedInnerNumbers.map(({ stepNumber, positionIndex }) => (
                     <span
                        key={`${index}-inner-step-${stepNumber}`}
                        className={cn(
                          "absolute pointer-events-none rounded-full bg-background/30 backdrop-blur-sm px-1 py-0.5", // Slightly more visible background
                           variant === 'secondary' ? 'text-accent-foreground/90' : 'text-foreground/80', // Adjust text color based on button state
                           stepNumber > 9 ? 'ring-1 ring-inset ring-primary/30' : '', // Subtle ring for double digits inner
                        )}
                        style={getClockPositionStyle(positionIndex, false)} // isOuter = false
                        aria-hidden="true"
                      >
                        {stepNumber}
                      </span>
                  ))}
                   {/* Render Outer Step Numbers (13-24) */}
                   {positionedOuterNumbers.map(({ stepNumber, positionIndex }) => (
                     <span
                        key={`${index}-outer-step-${stepNumber}`}
                        className={cn(
                           "absolute pointer-events-none rounded-full bg-muted/70 backdrop-blur-md px-1.5 py-1 ring-2 ring-inset ring-primary/60 shadow-md", // More distinct background + ring + shadow for outer
                           variant === 'secondary' ? 'text-foreground font-semibold' : 'text-primary font-bold', // Bolder text for outer, ensure contrast
                           stepNumber > 19 ? 'ring-accent ring-offset-1 ring-offset-background' : '', // Stronger ring for > 19
                        )}
                        style={getClockPositionStyle(positionIndex, true)} // isOuter = true
                        aria-hidden="true"
                      >
                        {stepNumber}
                      </span>
                  ))}
                  {/* Render Third Ring Step Numbers (>24) - Style distinctly */}
                  {positionedThirdRingNumbers.map(({ stepNumber, positionIndex }) => (
                      <span
                          key={`${index}-third-step-${stepNumber}`}
                          className={cn(
                              "absolute pointer-events-none rounded-full bg-destructive/80 text-destructive-foreground backdrop-blur-lg px-2 py-1.5 ring-2 ring-inset ring-destructive-foreground/70 shadow-lg", // Destructive theme, strong contrast
                              "font-extrabold text-xs", // Smaller but bolder font for distinction
                          )}
                          // Adjust getClockPositionStyle or create a new one for the third ring's radius
                          style={getClockPositionStyle(positionIndex, true)} // Reusing outer for simplicity, could adjust radius
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
