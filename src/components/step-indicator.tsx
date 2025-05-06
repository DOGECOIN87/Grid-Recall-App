"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isSequenceEmpty: boolean;
  disabled?: boolean; // Add disabled prop
}

export function StepIndicator({ currentStep, totalSteps, onPrevious, onNext, isSequenceEmpty, disabled = false }: StepIndicatorProps) {
  const isPrevDisabled = currentStep === 0 || isSequenceEmpty || disabled;
  const isNextDisabled = currentStep === totalSteps || isSequenceEmpty || disabled;

  return (
    <div className="flex items-center justify-center gap-3 md:gap-4">
      <Button
        onClick={onPrevious}
        variant="outline"
        size="icon"
        className={cn(
            "bg-background hover:bg-accent hover:text-accent-foreground border-border/70",
            isPrevDisabled && "opacity-40 cursor-not-allowed" // Use opacity and cursor for disabled state
        )}
        disabled={isPrevDisabled} // Apply disabled state
        aria-label="Previous Step"
        aria-disabled={isPrevDisabled} // Use aria-disabled
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <span
        className="text-base md:text-lg font-medium text-foreground/90 tabular-nums whitespace-nowrap px-3 py-1 bg-background/50 rounded-md shadow-inner border border-border/30"
        aria-live="polite"
        aria-atomic="true"
      >
        Step: <span className="font-bold">{currentStep}</span> / {totalSteps}
      </span>
      <Button
        onClick={onNext}
        variant="outline"
        size="icon"
        className={cn(
            "bg-background hover:bg-accent hover:text-accent-foreground border-border/70",
            isNextDisabled && "opacity-40 cursor-not-allowed" // Use opacity and cursor for disabled state
        )}
        disabled={isNextDisabled} // Apply disabled state
        aria-label="Next Step"
        aria-disabled={isNextDisabled} // Use aria-disabled
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
