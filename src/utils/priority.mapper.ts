export const PRIORITY_MAP = {
  0: 'low',
  1: 'medium',
  2: 'high'
} as const;

export const PRIORITY_REVERSE = {
  low: 0,
  medium: 1,
  high: 2
} as const;

export function toPriorityString(value: number) {
  return PRIORITY_MAP[value as keyof typeof PRIORITY_MAP];
}

export function toPriorityNumber(value: string) {
  return PRIORITY_REVERSE[value as keyof typeof PRIORITY_REVERSE];
}