import type { ChatPersistence } from "~/domain/ports/ChatPersistence.server";
import { conversationSchema } from "~/domain/schemas";
import type { Conversation } from "~/domain/types";
import { getErrorMessage } from "~/infrastructure/presentation/lib/getErrorMessage";
import { storage } from "~/infrastructure/presentation/lib/nodePersistClient.server";

/**
 * Adapteur responsable de la persistance de la conversation dans le storage node-persist côté serveur.
 * Gère la sérialisation/désérialisation des données et la validation du schéma.
 */
export class NodePersistAdapter implements ChatPersistence {
  private STORAGE_KEY = "chatbot-client";

  /**
   * Récupère la conversation stockée dans le storage.
   * Si aucune donnée n'existe ou si les données sont invalides,
   * retourne une nouvelle conversation vide.
   */
  async getConversation(): Promise<Conversation> {
    try {
      const stored = await storage.getItem(this.STORAGE_KEY);

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

      // Valider le JSON issu du storage avec le schéma Zod
      const result = conversationSchema.safeParse(rawData);

      if (!result.success) {
        console.error("Invalid data structure in storage:", result.error);
        return { messages: [] };
      }

      return result.data;
    } catch (error) {
      console.error("Error reading from storage:", getErrorMessage(error));
      return { messages: [] };
    }
  }

  /**
   * Sauvegarde la conversation dans le storage.
   * Les dates sont converties en chaînes ISO pour le stockage.
   */
  async saveConversation(conversation: Conversation): Promise<void> {
    // Transformer les dates en strings pour le stockage
    const serializedConversation = {
      messages: conversation.messages.map((msg) => ({
        ...msg,
        timestamp: msg.timestamp.toISOString(),
      })),
    };

    await storage.setItem(
      this.STORAGE_KEY,
      JSON.stringify(serializedConversation),
    );
  }

  async resetConversation(): Promise<void> {
    await storage.removeItem(this.STORAGE_KEY);
  }
}
