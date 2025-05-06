"use client";

import React from 'react';
import type { GridSize } from '@/app/page';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface GridConfiguratorProps {
  gridSize: GridSize;
  onGridSizeChange: (size: GridSize) => void;
}

const gridSizes: GridSize[] = [
  '3x3', '3x4', '3x5', '3x6',
  '4x3', '4x4', '4x5', '4x6',
  '5x3', '5x4', '5x5', '5x6',
];

export function GridConfigurator({ gridSize, onGridSizeChange }: GridConfiguratorProps) {
  return (
    <div className="flex items-center gap-3 bg-background/30 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10 shadow-inner">
      <Label 
        htmlFor="grid-size-select" 
        className="text-sm font-semibold text-foreground/90 whitespace-nowrap px-3 py-1.5 rounded-full bg-accent/10 shadow-sm"
      >
        Grid Size
      </Label>
      <Select
        value={gridSize}
        onValueChange={(value: GridSize) => onGridSizeChange(value)}
      >
        {/* Enhanced select trigger with glass effect */}
        <SelectTrigger
          id="grid-size-select"
          className="w-[100px] h-10 glass-effect border-white/20 shadow-md focus:ring-2 focus:ring-accent/50 focus:ring-offset-1 transition-all duration-300 rounded-full"
        >
          <SelectValue placeholder="Select size" />
        </SelectTrigger>
        
        {/* Enhanced select content with glass effect */}
        <SelectContent 
          className="glass-effect border border-white/10 shadow-lg backdrop-blur-md"
          position="popper"
          sideOffset={5}
        >
          <div className="grid grid-cols-4 gap-1 p-1">
            {gridSizes.map((size) => (
              <SelectItem 
                key={size} 
                value={size} 
                className={cn(
                  "focus:bg-accent/20 focus:text-accent-foreground rounded-md text-center transition-all duration-200",
                  "data-[state=checked]:bg-accent data-[state=checked]:text-accent-foreground data-[state=checked]:font-semibold",
                  gridSize === size ? "bg-accent/20" : "hover:bg-accent/10"
                )}
              >
                {size}
              </SelectItem>
            ))}
          </div>
        </SelectContent>
      </Select>
    </div>
  );
}
