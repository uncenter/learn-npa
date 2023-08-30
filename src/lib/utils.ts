import type { ClassValue } from 'clsx';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...classLists: ClassValue[]) => twMerge(clsx(classLists));

export const mergeArrays = <T>(...arrays: T[][]): T[] => ([] as T[]).concat(...arrays);
