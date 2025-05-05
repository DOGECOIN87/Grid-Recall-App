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
    <div className="flex items-center gap-2">
      <Label htmlFor="grid-size-select" className="text-sm font-medium text-foreground/80 whitespace-nowrap">
        Grid Size:
      </Label>
      <Select
        value={gridSize}
        onValueChange={(value: GridSize) => onGridSizeChange(value)}
      >
        {/* Use a slightly elevated trigger for better visual separation */}
        <SelectTrigger
          id="grid-size-select"
          className="w-[100px] h-10 bg-background shadow-sm border-border/70 focus:ring-2 focus:ring-ring focus:ring-offset-0"
        >
          <SelectValue placeholder="Select size" />
        </SelectTrigger>
        <SelectContent className="bg-popover text-popover-foreground shadow-lg border-border/50">
          {gridSizes.map((size) => (
            <SelectItem key={size} value={size} className="focus:bg-accent focus:text-accent-foreground">
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
