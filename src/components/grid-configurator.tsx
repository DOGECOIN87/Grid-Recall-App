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
    <div className="flex flex-col sm:flex-row items-center gap-4">
      <Label htmlFor="grid-size-select" className="text-lg font-medium whitespace-nowrap">
        Grid Size:
      </Label>
      <Select
        value={gridSize}
        onValueChange={(value: GridSize) => onGridSizeChange(value)}
      >
        <SelectTrigger id="grid-size-select" className="w-full sm:w-[180px]">
          <SelectValue placeholder="Select grid size" />
        </SelectTrigger>
        <SelectContent>
          {gridSizes.map((size) => (
            <SelectItem key={size} value={size}>
              {size}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
