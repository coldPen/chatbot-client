import { createMessage } from "~/domain/factories/createMessage";
import type { ChatCompletion } from "~/domain/ports/ChatCompletion.server";
import type {
  BotMessage,
  Conversation,
  Message,
  UserMessage,
} from "~/domain/types";

import { StorageService } from "~/application/storage-service.server";

/**
 * Service gérant la logique métier des conversations.
 * Responsable de l'envoi des messages et de la génération des réponses du bot.
 */

export class ChatService {
  private static completion: ChatCompletion;

  /**
   * Initialize the chat service with a specific completion implementation
   */
  static initialize(completionAdapter: ChatCompletion): void {
    this.completion = completionAdapter;
  }

  /**
   * Envoie un message utilisateur et génère une réponse du bot.
   * Le processus inclut :
   * 1. Création du message utilisateur
   * 2. Génération et ajout de la réponse du bot
   * 3. Sauvegarde de la conversation mise à jour
   */
  static async sendMessage(
    message: Message,
    responseId?: string,
  ): Promise<void> {
    if (!this.completion) {
      throw new Error("ChatService not initialized. Call initialize() first.");
    }

    const conversation = await StorageService.getConversation();

    const userMessage: UserMessage = createMessage(message.content, "user", {
      id: message.id,
      timestamp: new Date(message.timestamp),
    });

    const botMessage: BotMessage = createMessage(
      await this.completion.generateResponse(conversation, message.content),
      "bot",
      { id: responseId },
    );

    const updatedConversation: Conversation = {
      messages: [...conversation.messages, userMessage, botMessage],
    };

    await StorageService.saveConversation(updatedConversation);
  }
}
