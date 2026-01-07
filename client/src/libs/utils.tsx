import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function isoToYYYYMMDD(isoString: string | undefined) {
  if (!isoString) return '-----';
  const d = new Date(isoString);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function calculateRating(
  pos: number | null | undefined,
  neg: number | null | undefined
) {
  const posValue = pos ? pos : 0;
  const negValue = neg ? neg : 0;
  if (posValue + negValue === 0) return 10;
  return Number((posValue / (posValue + negValue)) * 10).toFixed(1);
}
