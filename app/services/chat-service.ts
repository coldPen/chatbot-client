import type { Conversation, Message } from "~/domain/types";
import { generateBotResponse } from "~/services/generateBotResponse";
import { StorageService } from "~/services/storage-service";

/**
 * Service gérant la logique métier des conversations.
 * Responsable de l'envoi des messages et de la génération des réponses du bot.
 */
export class ChatService {
  /**
   * Envoie un message utilisateur et génère une réponse du bot.
   * Le processus inclut :
   * 1. Création du message utilisateur
   * 2. Simulation d'un délai de réponse (1s)
   * 3. Génération et ajout de la réponse du bot
   * 4. Sauvegarde de la conversation mise à jour
   */
  static async sendMessage(content: string): Promise<void> {
    const conversation = StorageService.getConversation();

    const userMessage: Message = {
      id: crypto.randomUUID(),
      content,
      sender: "user",
      timestamp: new Date(),
    };

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const botMessage: Message = {
      id: crypto.randomUUID(),
      content: generateBotResponse(content),
      sender: "bot",
      timestamp: new Date(),
    };

    const updatedConversation: Conversation = {
      messages: [...conversation.messages, userMessage, botMessage],
    };

    StorageService.saveConversation(updatedConversation);
  }
}
