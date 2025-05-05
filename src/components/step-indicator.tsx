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
    <div className="flex items-center justify-center gap-4 mt-4">
      <Button
        onClick={onPrevious}
        variant="outline"
        size="icon"
        disabled={currentStep === 0 || isSequenceEmpty}
        aria-label="Previous Step"
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      <span className="text-lg font-medium tabular-nums whitespace-nowrap" aria-live="polite">
        Step: {currentStep} / {totalSteps}
      </span>
      <Button
        onClick={onNext}
        variant="outline"
        size="icon"
        disabled={currentStep === totalSteps || isSequenceEmpty}
        aria-label="Next Step"
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
