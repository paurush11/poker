import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const sendJSONMessage = (action: string, payload: { [key: string]: string | number | boolean }) => {
  return {
    action: action,
    payload: payload
  }
}