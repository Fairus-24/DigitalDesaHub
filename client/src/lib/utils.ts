import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const API_BASE_URL = import.meta.env.DEV 
  ? 'http://0.0.0.0:5000/api'
  : '/api';
