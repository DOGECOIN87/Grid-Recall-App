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
            "bg-background/50 hover:bg-accent hover:text-accent-foreground border-white/20 backdrop-blur-sm shadow-md transition-all duration-300",
            "hover:shadow-lg hover:-translate-y-0.5",
            isPrevDisabled && "opacity-40 cursor-not-allowed hover:translate-y-0 hover:shadow-md" 
        )}
        disabled={isPrevDisabled}
        aria-label="Previous Step"
        aria-disabled={isPrevDisabled}
      >
        <ChevronLeft className="h-5 w-5" />
      </Button>
      
      {/* Enhanced step counter with glass effect and animation */}
      <div 
        className={cn(
          "glass-effect rounded-lg px-4 py-2 shadow-lg border border-white/20",
          "relative overflow-hidden",
          !isSequenceEmpty && "animate-pulse-slow", // Subtle animation when sequence exists
          "bg-gradient-to-r from-background/80 via-background/60 to-background/80" // Gradient background
        )}
      >
        {/* Background decorative elements */}
        <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-accent/10 opacity-70"></div>
        
        {/* Enhanced glow effect */}
        <div className="absolute inset-0 bg-accent/5 rounded-lg filter blur-md opacity-50"></div>
        
        {/* Step counter text with improved styling */}
        <span
          className="relative z-10 text-base md:text-lg font-medium text-foreground/90 tabular-nums whitespace-nowrap"
          aria-live="polite"
          aria-atomic="true"
        >
          Step: <span className="font-extrabold text-glow text-accent">{currentStep}</span> 
          <span className="mx-1 opacity-70">/</span> 
          <span className={cn(
            "font-bold",
            totalSteps > 0 ? "text-accent" : "text-muted-foreground"
          )}>
            {totalSteps}
          </span>
        </span>
      </div>
      
      <Button
        onClick={onNext}
        variant="outline"
        size="icon"
        className={cn(
            "bg-background/50 hover:bg-accent hover:text-accent-foreground border-white/20 backdrop-blur-sm shadow-md transition-all duration-300",
            "hover:shadow-lg hover:-translate-y-0.5",
            isNextDisabled && "opacity-40 cursor-not-allowed hover:translate-y-0 hover:shadow-md"
        )}
        disabled={isNextDisabled}
        aria-label="Next Step"
        aria-disabled={isNextDisabled}
      >
        <ChevronRight className="h-5 w-5" />
      </Button>
    </div>
  );
}
