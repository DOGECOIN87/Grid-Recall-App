"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  isSequenceEmpty: boolean;
}

export function StepIndicator({ currentStep, totalSteps, onPrevious, onNext, isSequenceEmpty }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-center gap-3 md:gap-4">
      {/* Use slightly more prominent buttons */}
      <Button
        onClick={onPrevious}
        variant="outline"
        size="icon"
        className="bg-background hover:bg-accent hover:text-accent-foreground border-border/70 disabled:opacity-40"
        disabled={currentStep === 0 || isSequenceEmpty}
        aria-label="Previous Step"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      {/* Improve text styling */}
      <span
        className="text-base md:text-lg font-medium text-foreground/90 tabular-nums whitespace-nowrap px-3 py-1 bg-background/50 rounded-md shadow-inner border border-border/30"
        aria-live="polite"
        aria-atomic="true" // Ensures screen readers announce the whole text when it changes
      >
        Step: <span className="font-bold">{currentStep}</span> / {totalSteps}
      </span>
      <Button
        onClick={onNext}
        variant="outline"
        size="icon"
        className="bg-background hover:bg-accent hover:text-accent-foreground border-border/70 disabled:opacity-40"
        disabled={currentStep === totalSteps || isSequenceEmpty}
        aria-label="Next Step"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
