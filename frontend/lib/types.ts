// Model types
export type ModelProvider = "claude" | "titan" | "llama";

export interface ModelOption {
  id: ModelProvider;
  name: string;
  description: string;
  modelId: string;
}

// Document types
export interface Document {
  id: string;
  name: string;
  type: string;
  size: number;
  content: string;
  uploadedAt: number;
}

export type DocumentStatus =
  | "idle"
  | "uploading"
  | "processing"
  | "success"
  | "error";

// Chat types
export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: number;
}

export interface ChatSession {
  messages: Message[];
  model: ModelProvider;
  documentId: string | null;
}

// API types
export interface ChatRequestBody {
  messages: Message[];
  model: ModelProvider;
  documentId: string | null;
}

export interface ChatResponseBody {
  message: Message;
}

export interface UploadRequestBody {
  file: File;
}

export interface UploadResponseBody {
  document: Document;
}
