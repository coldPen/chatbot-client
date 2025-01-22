import type { Conversation, Message } from "~/domain/types";
import { generateBotResponse } from "~/services/generateBotResponse";
import { StorageService } from "~/services/storage-service";

/**
 * Service gérant la logique métier des conversations.
 * Responsable de l'envoi des messages et de la génération des réponses du bot.
 */
export class ChatService {
  /**
   * Crée un nouveau message avec les informations fournies.
   * @param content Le contenu du message.
   * @param sender L'expéditeur du message ("user" ou "bot").
   * @param options Options supplémentaires pour le message (id et timestamp).
   * @returns Le message créé.
   */
  static createMessage<S extends Message["sender"]>(
    content: string,
    sender: S,
    options?: {
      id?: string;
      timestamp?: Date;
    }
  ): Message & { sender: S } {
    return {
      id: options?.id ?? crypto.randomUUID(),
      content,
      sender,
      timestamp: options?.timestamp ?? new Date(),
    };
  }

  /**
   * Envoie un message utilisateur et génère une réponse du bot.
   * Le processus inclut :
   * 1. Création du message utilisateur
   * 2. Simulation d'un délai de réponse (1s)
   * 3. Génération et ajout de la réponse du bot
   * 4. Sauvegarde de la conversation mise à jour
   */
  static async sendMessage(
    message: Message,
    responseId?: string
  ): Promise<void> {
    const conversation = StorageService.getConversation();

    const userMessage: Message = ChatService.createMessage(
      message.content,
      "user",
      {
        id: message.id,
        timestamp: message.timestamp ? new Date(message.timestamp) : undefined,
      }
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const botMessage: Message = ChatService.createMessage(
      generateBotResponse(message.content),
      "bot",
      {
        id: responseId,
      }
    );

    const updatedConversation: Conversation = {
      messages: [...conversation.messages, userMessage, botMessage],
    };

    StorageService.saveConversation(updatedConversation);
  }
}
