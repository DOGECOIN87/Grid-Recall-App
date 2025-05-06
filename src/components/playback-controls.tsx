
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
      <div className="flex items-center justify-center gap-2 md:gap-3">
        {/* Play/Pause Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={isPlaying ? onPause : onPlay}
              variant="outline"
              size="icon"
              className={cn(
                'bg-background hover:bg-accent hover:text-accent-foreground border-border/70',
                disabled && 'opacity-40 cursor-not-allowed'
              )}
              disabled={disabled}
              aria-label={isPlaying ? 'Pause Playback' : 'Play Sequence'}
              aria-disabled={disabled}
            >
              {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>{isPlaying ? 'Pause Playback' : 'Play Sequence'}</p>
          </TooltipContent>
        </Tooltip>

        {/* Stop Button */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={onStop}
              variant="outline"
              size="icon"
              className={cn(
                'bg-background hover:bg-destructive/10 hover:text-destructive border-border/70',
                 // Disable only if sequence is empty, allow stop even during playback
                (disabled && !isPlaying) && 'opacity-40 cursor-not-allowed'
              )}
              disabled={disabled && !isPlaying}
              aria-label="Stop Playback and Reset"
              aria-disabled={disabled && !isPlaying}
            >
              <Square className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom">
             <p>Stop Playback & Reset</p>
           </TooltipContent>
        </Tooltip>
      </div>
    </TooltipProvider>
  );
}
