
"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';


interface PlaybackControlsProps { // Renamed interface
  isPlaying: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
  disabled?: boolean;
}

// Renamed component export
export function PlaybackControls({ isPlaying, onPlay, onPause, onStop, disabled = false }: PlaybackControlsProps) {
  return (
    <TooltipProvider>
      <div className="flex items-center justify-center gap-3 md:gap-4 p-1 rounded-full bg-background/30 backdrop-blur-md border border-white/10 shadow-inner">
        {/* Play/Pause Button with enhanced styling */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={isPlaying ? onPause : onPlay}
              variant="outline"
              size="icon"
              className={cn(
                'bg-background/50 backdrop-blur-sm border-white/20 shadow-md transition-all duration-300',
                'hover:shadow-lg hover:-translate-y-0.5',
                isPlaying 
                  ? 'bg-accent/20 hover:bg-accent/30 text-accent-foreground ring-2 ring-accent/50' // Playing state with ring
                  : 'hover:bg-accent/20 hover:text-accent-foreground hover:ring-2 hover:ring-accent/30', // Ready to play state
                'rounded-full', // Make buttons perfectly round
                disabled && 'opacity-40 cursor-not-allowed hover:translate-y-0 hover:shadow-md'
              )}
              disabled={disabled}
              aria-label={isPlaying ? 'Pause Playback' : 'Play Sequence'}
              aria-disabled={disabled}
            >
              {isPlaying 
                ? <Pause className="h-5 w-5 animate-pulse" /> 
                : <Play className="h-5 w-5" />
              }
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="glass-effect border border-white/10 shadow-lg">
            <p>{isPlaying ? 'Pause Playback' : 'Play Sequence'}</p>
          </TooltipContent>
        </Tooltip>

        {/* Stop Button with enhanced styling */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onStop}
              variant="outline"
              size="icon"
              className={cn(
                'bg-background/50 backdrop-blur-sm border-white/20 shadow-md transition-all duration-300',
                'hover:shadow-lg hover:-translate-y-0.5',
                'hover:bg-destructive/20 hover:text-destructive hover:border-destructive/30 hover:ring-2 hover:ring-destructive/30',
                'rounded-full', // Make buttons perfectly round
                (disabled && !isPlaying) && 'opacity-40 cursor-not-allowed hover:translate-y-0 hover:shadow-md'
              )}
              disabled={disabled && !isPlaying}
              aria-label="Stop Playback and Reset"
              aria-disabled={disabled && !isPlaying}
            >
              <Square className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="glass-effect border border-white/10 shadow-lg">
            <p>Stop Playback & Reset</p>
          </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
