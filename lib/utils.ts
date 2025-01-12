import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Convert prisma object into a regular JS object
export function convertToPlainObject<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

// Format number with decimal places
export function formatNumberWithDecimal(num: number, digits = 2): string {
  const [int, decimal] = num.toString().split('.');
  return decimal
    ? `${int}.${decimal.substring(0, digits).padEnd(digits, '0')}`
    : `${int}.` + '0'.repeat(digits);
}
