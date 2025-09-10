import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function formatPrice(
  price: number,
  options: {
    currency?: "USD" | "EUR";
    notation?: Intl.NumberFormatOptions["notation"];
  } = {}
) {
  const { currency = "USD", notation = "standard" } = options;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    notation,
    minimumFractionDigits: 2,
  }).format(price);
}

export function formatDate(
  date: Date | string,
  options: Intl.DateTimeFormatOptions = {}
) {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  }).format(dateObj);
}

export function truncate(str: string, length: number) {
  return str.length > length ? `${str.substring(0, length)}...` : str;
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "");
}

export function absoluteUrl(path: string) {
  if (typeof window !== "undefined") return path;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}${path}`;
  return `http://${process.env.PORT ?? 3000}${path}`;
}

export function getInitials(name: string) {
  return name
    .split("")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function generateId(length: number = 8) {
  return Math.random()
    .toString(36)
    .substring(2, 2 + length);
}
