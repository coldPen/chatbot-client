import type { Conversation } from "~/domain/types";

export interface ChatPersistence {
  getConversation(): Promise<Conversation>;
  saveConversation(conversation: Conversation): Promise<void>;
  resetConversation(): Promise<void>;
}
