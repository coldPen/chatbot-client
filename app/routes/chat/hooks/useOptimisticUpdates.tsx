import { useEffect, useState } from "react";
import { useFetcher } from "react-router";
import type { Conversation, Message } from "~/domain/types";
import type { ChatService } from "~/services/chat-service";

/**
 * Hook personnalisé pour gérer les mises à jour optimistes dans l'interface de chat.
 * Il permet d'afficher immédiatement les messages de l'utilisateur et un placeholder de réponse du bot
 * avant que la réponse réelle ne soit générée, améliorant ainsi l'expérience utilisateur.
 *
 * @param {Object} params - Les paramètres du hook
 * @param {FormData | undefined} params.formData - Les données du formulaire en cours de soumission
 * @param {Conversation} params.conversation - L'état actuel de la conversation
 * @param {typeof ChatService.createMessage} params.createMessage - Fonction pour créer un nouveau message
 *
 * @returns {Object} Un objet contenant :
 *   - allMessages: Liste combinée des messages existants et des aperçus optimistes
 *   - createOptimisticMessages: Fonction pour créer une paire de messages optimistes (utilisateur + bot)
 */
export function useOptimisticUpdates({
  formData,
  conversation,
  createMessage,
}: {
  formData: FormData | undefined;
  conversation: Conversation;
  createMessage: typeof ChatService.createMessage;
}) {
  const fetcher = useFetcher();

  // État local pour stocker la paire de messages optimistes (message utilisateur + réponse bot temporaire)
  const [messagePreviews, setMessagePreviews] = useState<
    [Message & { sender: "user" }, Message & { sender: "bot" }] | null
  >(null);

  // Détermine si un message est en cours d'envoi basé sur l'action du formulaire
  const isSendingMessage =
    formData?.get("actionType") === "send-message" && messagePreviews;

  // Réinitialise les aperçus de messages une fois qu'ils ne sont plus nécessaires
  useEffect(() => {
    if (!isSendingMessage) {
      setMessagePreviews(null);
    }
  }, [isSendingMessage]);

  /**
   * Crée une paire de messages optimistes : le message de l'utilisateur et un placeholder pour la réponse du bot.
   * @param {string} messageText - Le texte du message de l'utilisateur
   * @returns {[Message, Message]} Une paire de messages [userMessage, botMessage]
   */
  const createOptimisticMessages = (messageText: string) => {
    const userMessage = createMessage(messageText, "user");
    const botMessage = createMessage("", "bot");

    setMessagePreviews([userMessage, botMessage]);

    return [userMessage, botMessage];
  };

  // Combine les messages existants avec les aperçus optimistes si nécessaire
  const allMessages = isSendingMessage
    ? [...conversation.messages, ...messagePreviews]
    : conversation.messages;

  return { allMessages, createOptimisticMessages };
}
