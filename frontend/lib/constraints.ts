import { ModelOption } from "./types";

// Model options for MVP
export const MODEL_OPTIONS: ModelOption[] = [
  {
    id: "claude",
    name: "Anthropic Claude",
    description:
      "General purpose AI assistant with strong reasoning capabilities",
    modelId: "anthropic.claude-3-haiku-20240307-v1:0",
  },
  {
    id: "titan",
    name: "Amazon Titan",
    description: "AWS-built language model focused on accuracy and safety",
    modelId: "amazon.titan-text-express-v1",
  },
  {
    id: "llama",
    name: "Meta Llama 3",
    description: "Open-source model with strong capabilities",
    modelId: "meta.llama3-8b-instruct-v1:0",
  },
];

// DynamoDB table name
export const DYNAMODB_TABLE_NAME = "healthcare-benefits-documents";

// Rate limiting for app usage
export const RATE_LIMIT = {
  MAX_REQUESTS_PER_MINUTE: 20,
  MAX_TOKENS_PER_MINUTE: 40000,
};

// System prompts
export const SYSTEM_PROMPTS = {
  DEFAULT: `You are a healthcare benefits assistant. Your job is to help users understand
     their healthcare benefits based on the documents they've provided. Answer questions
     accurately and concisely based solely on the information in the provided documents.
     If the information is not available in the documents, clearly state that you cannot
     find the relevant information.`,
};

// File upload constraints
export const UPLOAD_CONSTRAINTS = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_FILE_TYPES: [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
};
