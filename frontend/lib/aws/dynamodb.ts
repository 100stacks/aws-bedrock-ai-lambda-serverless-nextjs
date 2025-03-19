import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  QueryCommand,
  DeleteCommand,
  ScanCommand,
} from "@aws-sdk/lib-dynamodb";
import { Document } from "@/lib/types";
import { DYNAMODB_TABLE_NAME } from "@/lib/constraints";

// Initialize DynamoDB clients
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const docClient = DynamoDBDocumentClient.from(client);

// Store a document
export async function storeDocument(document: Document): Promise<void> {
  const command = new PutCommand({
    TableName: DYNAMODB_TABLE_NAME,
    Item: document,
  });

  try {
    await docClient.send(command);
  } catch (error) {
    console.error("Error storing document:", error);
    throw error;
  }
}

// Get a document by ID
export async function getDocument(id: string): Promise<Document | null> {
  const command = new GetCommand({
    TableName: DYNAMODB_TABLE_NAME,
    Key: { id },
  });

  try {
    const response = await docClient.send(command);
    return (response.Item as Document) || null;
  } catch (error) {
    console.error("Error getting document:", error);
    throw error;
  }
}

// Query all documents based on a condition
// https://dynobase.dev/dynamodb-scan-vs-query/ | https://dynobase.dev/dynamodb-scan-vs-query/
export async function queryDocuments<T extends Document>(
  partitionKey: string,
  partitionValue: string,
  sortKeyCondition?: string,
  sortKeyValues?: Record<string, any>,
  indexName?: string
): Promise<T[]> {
  let keyConditionExpression = `${partitionKey} = :partitionValue`;
  let expressionAttributeValues: Record<string, any> = {
    ":partitionValue": partitionValue,
  };

  // Add sort key condition if provided
  if (sortKeyCondition && sortKeyValues) {
    keyConditionExpression += ` AND ${sortKeyCondition}`;
    expressionAttributeValues = {
      ...expressionAttributeValues,
      ...sortKeyValues,
    };
  }

  const params = {
    TableName: DYNAMODB_TABLE_NAME,
    KeyConditionExpression: keyConditionExpression,
    ExpressionAttributeValues: expressionAttributeValues,
    IndexName: indexName,
  };

  // Remove undefined values
  if (!indexName) delete params.IndexName;

  try {
    const command = new QueryCommand(params);
    const response = await docClient.send(command);
    return (response.Items as T[]) || [];
  } catch (error) {
    console.error("Error querying documents:", error);
    throw error;
  }
}

// List all documents
export async function listDocuments(): Promise<Document[]> {
  const command = new ScanCommand({
    TableName: DYNAMODB_TABLE_NAME,
  });

  try {
    const response = await docClient.send(command);
    return (response.Items as Document[]) || [];
  } catch (error) {
    console.error("Error listing documents:", error);
    throw error;
  }
}

// Delete a document
export async function deleteDocument(id: string): Promise<void> {
  const command = new DeleteCommand({
    TableName: DYNAMODB_TABLE_NAME,
    Key: { id },
  });

  try {
    await docClient.send(command);
  } catch (error) {
    console.error("Error deleting document:", error);
    throw error;
  }
}
