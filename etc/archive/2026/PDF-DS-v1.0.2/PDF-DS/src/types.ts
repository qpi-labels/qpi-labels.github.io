/**
 * types.ts
 * Defining type structures for PDF-DS design guideline documentation,
 * interactive sandboxes, and application state metrics.
 */

export interface SpacingToken {
  name: string;
  rem: string;
  px: number;
  useCase: string;
}

export interface TypographyToken {
  token: string;
  font: string;
  size: string;
  lineHeight: string;
  tracking: string;
  usage: string;
}

export interface ColorToken {
  token: string;
  hex: string;
  layer: string;
  rule: string;
}

export interface QACheckItem {
  id: string;
  category: string;
  label: string;
  checked: boolean;
}

export type CodePlatform = 'web' | 'android' | 'ios';

export type SimulationMode = 'none' | 'protanopia' | 'deuteranopia' | 'text-zoom-200';
