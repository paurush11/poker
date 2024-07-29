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

export const fetchCards = (cards: string[]): string[] => {
  return cards.map(card => {
    let value = card.split(':')[0];
    let suite = card.split(':')[1];
    if (value === "Ace" || value === "King" || value === "Queen" || value === "Jack") {
      value = value.toLowerCase() + "_of_" + suite.toLowerCase();
    } else {
      value = value + "_of_" + suite.toLowerCase();
    }
    return value;
  })

}