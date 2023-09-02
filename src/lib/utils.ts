import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...classLists: ClassValue[]) => twMerge(clsx(classLists));

export function getRandomItem<T>(arr: T[]): T {
	return arr[Math.floor(Math.random() * arr.length)];
}
