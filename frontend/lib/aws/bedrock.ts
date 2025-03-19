import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";
import { ModelProvider } from "../types";
import { MODEL_OPTIONS } from "../constraints";
import { get } from "http";
import { text } from "stream/consumers";

// Initialize the Bedrock client
const bedrockClient = new BedrockRuntimeClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

// Get the model ID from the model provider
const getModelId = (provider: ModelProvider): string => {
  const model = MODEL_OPTIONS.find((m) => m.id === provider);
  if (!model) {
    throw new Error(`Unknow model provider: ${provider}`);
  }

  return model.modelId;
};

// Structure prompts for different model providers
const structurePrompt = (
  provider: ModelProvider,
  messages: Array<{ role: string; content: string }>,
  documentContent?: string
) => {
  // Add document context if available
  const systemContent = documentContent
    ? `You are a healthcare benefits assistant. Your job is to help users understand their healthcare benefits based on the documents they've provided. Answer questions accurately and concisely based solely on the information in the provided documents. If the information is not available in the documents, clearly state that you cannot find the relevant information. Here is the document content: ${documentContent}`
    : "You are a healthcare benefits assistant. Your job is to help users understand their healthcare benefits. Since no documents have been provided, you can only answer general questions about healthcare benefits and cannot provide specific policy details. Please ask the user to upload their benefits documents for more specific assistance.";

  switch (provider) {
    case "claude":
      return {
        anthropic_version: "bedrock-2023-05-31",
        max_tokens: 1024,
        messages: [
          { role: "system", content: systemContent },
          ...messages.map((m) => ({
            role: m.role === "assistant" ? "assistant" : "user",
            content: m.content,
          })),
        ],
      };

    case "titan":
      // AWS Titan uses a different format
      return {
        inputText:
          `<system>${systemContent}</system>\n` +
          messages
            .map((m) => {
              if (m.role === "assistant") {
                return `<assistant>${m.content}</assistant>`;
              } else {
                return `<user>${m.content}</user>`;
              }
            })
            .join("\n") +
          "<assistant>",
        textGenerationConfig: {
          maxTokenCount: 1024,
          temperature: 0.7,
          topP: 0.9,
        },
      };

    case "llama":
      // Meta Llama format
      return {
        prompt:
          `<system>${systemContent}</system>\n` +
          messages
            .map((m) => {
              if (m.role === "assistant") {
                return `<assistant>${m.content}</assistant>`;
              } else {
                return `<user>${m.content}</user>`;
              }
            })
            .join("\n") +
          "<assistant>",
        max_gen_len: 1024,
        temperature: 0.7,
        top_p: 0.9,
      };

    default:
      throw new Error(`Unsupported model provider: ${provider}`);
  }
};

// Parse response from different model providers
const parseResponse = (provider: ModelProvider, response: any): string => {
  switch (provider) {
    case "claude":
      return response.content[0].text;

    case "titan":
      return response.results[0].outputText;

    case "llama":
      return response.generation;

    default:
      throw new Error(`Unsupported model provider: ${provider}`);
  }
};

// Invoke the model with streaming support
export async function invokeModel(
  provider: ModelProvider,
  messages: Array<{ role: string; content: string }>,
  documentContent?: string
): Promise<ReadableStream> {
  const modelId = getModelId(provider);
  const requestBody = structurePrompt(provider, messages, documentContent);

  const command = new InvokeModelCommand({
    modelId,
    contentType: "application/json",
    accept: "application/json",
    body: JSON.stringify(requestBody),
  });

  try {
    const response = await bedrockClient.send(command);

    // Parse the response based on the provider
    const responseBody = JSON.parse(new TextDecoder().decode(response.body));
    const textResponse = parseResponse(provider, requestBody);

    // Create a stream from the response
    const stream = new ReadableStream({
      start(controller) {
        controller.enqueue(textResponse);
        controller.close();
      },
    });

    return stream;
  } catch (error: unknown) {
    console.error(`Error invoking model: ${error}`);

    throw error;
  }
}
