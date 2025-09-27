/**
 * Card Component Barrel Export
 * Compound component pattern implementation
 */

import Card from './Card';
import CardHeader from './CardHeader';
import CardContent from './CardContent';

// Compound component pattern
const CardCompound = Card as typeof Card & {
  Header: typeof CardHeader;
  Content: typeof CardContent;
};

CardCompound.Header = CardHeader;
CardCompound.Content = CardContent;

export { CardCompound as Card, CardHeader, CardContent };
export type { CardProps } from './Card';
export type { CardHeaderProps } from './CardHeader';
export type { CardContentProps } from './CardContent';