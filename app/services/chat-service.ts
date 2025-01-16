import type { Conversation, Message } from "~/domain/types";
import { generateBotResponse } from "~/services/generateBotResponse";
import { StorageService } from "~/services/storage-service";

export class ChatService {
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
