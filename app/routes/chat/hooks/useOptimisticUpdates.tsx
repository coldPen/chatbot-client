import { useEffect, useState } from "react";
import type { Conversation, Message } from "~/domain/types";
import type { ChatService } from "~/services/chat-service";

export function useOptimisticUpdates({
  formData,
  conversation,
  createMessage,
}: {
  formData: FormData | undefined;
  conversation: Conversation;
  createMessage: typeof ChatService.createMessage;
}) {
  // Messages locaux pour la mise à jour optimiste (1 paire de messages "user" et "bot")
  const [messagePreviews, setMessagePreviews] = useState<
    [Message & { sender: "user" }, Message & { sender: "bot" }] | null
  >(null);

  const isSendingMessage =
    formData?.get("actionType") === "send-message" && messagePreviews;

  useEffect(() => {
    if (!isSendingMessage) {
      setMessagePreviews(null);
    }
  }, [isSendingMessage]);

  const createOptimisticMessages = (messageText: string) => {
    const userMessage = createMessage(messageText, "user");
    const botMessage = createMessage("", "bot");

    setMessagePreviews([userMessage, botMessage]);

    // les infos des messages créés sont retournées pour être envoyées via le formulaire
    return [userMessage, botMessage];
  };

  const allMessages = isSendingMessage
    ? [...conversation.messages, ...messagePreviews]
    : conversation.messages;

  return { allMessages, createOptimisticMessages };
}
