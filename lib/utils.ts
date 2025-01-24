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

// Format errors
//eslint-disable-next-line @typescript-eslint/no-explicit-any
export function formatError(error: any) {
  if (error.name === 'ZodError') {
    // Handle Zod error
    const fieldErrors = Object.keys(error.errors).map(
      (field) => error.errors[field].message
    );
    return fieldErrors.join('. ');
  } else if (
    error.name === 'PrismaClientKnownRequestError' &&
    error.code === 'P2002'
  ) {
    // Handle prisma error
    const field = error.meta?.target ? error.meta.target[0] : 'Field';
    return `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
  } else {
    // Handle other errors
    return typeof error.message === 'string'
      ? error.message
      : JSON.stringify(error.message);
  }
}

// Round number to 2 decimal places
export function round(value: number | string, digits = 2) {
  if (typeof value === 'number') {
    return Math.round((value + Number.EPSILON) * 10 ** digits) / 10 ** digits;
  } else if (typeof value === 'string') {
    return (
      Math.round((Number(value) + Number.EPSILON) * 10 ** digits) / 10 ** digits
    );
  } else throw new Error('Value is not a number or string');
}

const CURRENCY_FORMATTER = new Intl.NumberFormat('en-US', {
  currency: 'USD',
  style: 'currency',
  minimumFractionDigits: 2,
});

// format currency using the formatter above
export function formatCurrency(amount: number | string | null) {
  if (typeof amount === 'number') return CURRENCY_FORMATTER.format(amount);
  if (typeof amount === 'string')
    return CURRENCY_FORMATTER.format(Number(amount));
  return 'NaN';
}

// Shorten UUID
export function formatId(id: string) {
  return `..${id.substring(id.length - 6)}`;
}

// Format date and times
export const formatDateTime = (dateString: Date) => {
  const dateTimeOptions: Intl.DateTimeFormatOptions = {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  };
  const dateOptions: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    month: 'short',
    year: 'numeric',
    day: 'numeric',
  };
  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  };
  const formattedDateTime: string = new Date(dateString).toLocaleString(
    'de-AT',
    dateTimeOptions
  );
  const formattedDate: string = new Date(dateString).toLocaleString(
    'de-AT',
    dateOptions
  );
  const formattedTime: string = new Date(dateString).toLocaleString(
    'de-AT',
    timeOptions
  );
  return {
    dateTime: formattedDateTime,
    dateOnly: formattedDate,
    timeOnly: formattedTime,
  };
};
