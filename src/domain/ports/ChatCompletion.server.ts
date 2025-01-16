import type { Conversation } from "~/domain/types";

export interface ChatCompletion {
  generateResponse(
    conversation: Conversation,
    userMessage: string
  ): Promise<string>;
}
