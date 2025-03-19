import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { nanoid } from "nanoid";
import { Message, ModelProvider } from "./types";

/**
 * Combines Tailwind CSS classes
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a unique ID
 */
export function generateId(): string {
  return nanoid();
}

/**
 * Creates a new message
 */
export function createMessage(role: Message["role"], content: string): Message {
  return {
    id: generateId(),
    role,
    content,
    createdAt: Date.now(),
  };
}

/**
 * Parses file size to human-readable format
 */
export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + " bytes";
  else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  else return (bytes / 1048576).toFixed(1) + " MB";
}

/**
 * Formats date from timestamp
 */
export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}

/**
 * Validates file type is acceptable
 */
export function isValidFileType(type: string): boolean {
  const validTypes = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ];
  return validTypes.includes(type);
}

/**
 * Get model display name
 */
export function getModelName(modelId: ModelProvider): string {
  const modelNames: Record<ModelProvider, string> = {
    claude: "Anthropic Claude",
    titan: "AWS Titan",
    llama: "Meta Llama 3",
  };
  return modelNames[modelId];
}

/**
 * Truncates text to a specified length
 */
export function truncateText(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text;
}

/**
 * Creates a rate limiter
 */
export function createRateLimiter(maxRequests: number, timeWindow: number) {
  const requests: number[] = [];

  return function checkLimit(): boolean {
    const now = Date.now();

    // Remove expired timestamps
    while (requests.length > 0 && requests[0] <= now - timeWindow) {
      requests.shift();
    }

    // Check if we're under the limit
    if (requests.length < maxRequests) {
      requests.push(now);
      return true;
    }

    return false;
  };
}
