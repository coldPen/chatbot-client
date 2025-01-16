import type { Conversation } from "~/domain/types";
import { NodePersistAdapter } from "~/infrastructure/persistence/NodePersistAdapter.server";

export class StorageService {
  private static storage = new NodePersistAdapter();

  static async getConversation(): Promise<Conversation> {
    const conversation = await this.storage.getConversation();
    return conversation;
  }

  static async saveConversation(conversation: Conversation): Promise<void> {
    await this.storage.saveConversation(conversation);
  }

  static async resetConversation(): Promise<void> {
    await this.storage.resetConversation();
  }
}
