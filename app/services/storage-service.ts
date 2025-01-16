import { conversationSchema } from "~/domain/schemas";
import type { Conversation } from "~/domain/types";
import { getErrorMessage } from "~/lib/utils";

export class StorageService {
  private static STORAGE_KEY = "digitalkin_chat_conversation";

  static getConversation(): Conversation {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);

      if (!stored) {
        return { messages: [] };
      }

      // Première validation : s'assurer que c'est du JSON valide
      let rawData: unknown;
      try {
        rawData = JSON.parse(stored);
      } catch (error) {
        console.error(getErrorMessage(error));

        return { messages: [] };
      }

      // Valider avec le schéma Zod
      const result = conversationSchema.safeParse(rawData);

      if (!result.success) {
        console.error("Invalid data structure in localStorage:", result.error);
        return { messages: [] };
      }

      return result.data;
    } catch (error) {
      console.error("Error reading from localStorage:", getErrorMessage(error));
      return { messages: [] };
    }
  }

  static saveConversation(conversation: Conversation): void {
    // Transformer les dates en strings pour le stockage
    const serializedConversation = {
      messages: conversation.messages.map((msg) => ({
        ...msg,
        timestamp: msg.timestamp.toISOString(),
      })),
    };

    localStorage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(serializedConversation)
    );
  }
}
