import { Mood } from './types';

export const MOOD_CONFIG: Record<Mood, { value: number }> = {
  Awful: { value: 1 },
  Bad: { value: 2 },
  Okay: { value: 3 },
  Good: { value: 4 },
  Great: { value: 5 },
};