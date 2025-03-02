import type { ChatPersistence } from "~/domain/ports/ChatPersistence.server";
import type { Conversation } from "~/domain/types";

export class StorageService {
  private static persistence: ChatPersistence;

  /**
   * Initialize the storage service with a specific persistence implementation
   */
  static initialize(persistenceAdapter: ChatPersistence): void {
    this.persistence = persistenceAdapter;
  }

  static async getConversation(): Promise<Conversation> {
    if (!this.persistence) {
      throw new Error(
        "StorageService not initialized. Call initialize() first.",
      );
    }
    const conversation = await this.persistence.getConversation();
    return conversation;
  }

  static async saveConversation(conversation: Conversation): Promise<void> {
    if (!this.persistence) {
      throw new Error(
        "StorageService not initialized. Call initialize() first.",
      );
    }
    await this.persistence.saveConversation(conversation);
  }

  static async resetConversation(): Promise<void> {
    if (!this.persistence) {
      throw new Error(
        "StorageService not initialized. Call initialize() first.",
      );
    }
    await this.persistence.resetConversation();
  }
}
