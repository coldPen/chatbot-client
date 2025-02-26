import { useEffect, useState } from "react";

import type { Conversation, Message } from "~/domain/types";
import { createMessage } from "~/infrastructure/presentation/lib/createMessage";

type MessagePreviews = [
  Message & { sender: "user" },
  Message & { sender: "bot" },
];

/**
 * Hook personnalisé pour gérer les mises à jour optimistes dans l'interface de chat.
 * Il permet d'afficher immédiatement les messages de l'utilisateur et un placeholder de réponse du bot
 * avant que la réponse réelle ne soit générée, améliorant ainsi l'expérience utilisateur.
 *
 * @param {Object} params - Les paramètres du hook
 * @param {FormData | undefined} params.formData - Les données du formulaire en cours de soumission
 * @param {Conversation} params.conversation - L'état actuel de la conversation
 *
 * @returns {Object} Un objet contenant :
 *   - allMessages: Liste combinée des messages existants et des aperçus optimistes
 *   - createOptimisticMessages: Fonction pour créer une paire de messages optimistes (utilisateur + bot)
 */
export function useOptimisticUpdates({
  formData,
  conversation,
}: {
  formData: FormData | undefined;
  conversation: Conversation;
}) {
  // État local pour stocker la paire de messages optimistes (message utilisateur + réponse bot temporaire)
  const [messagePreviews, setMessagePreviews] =
    useState<MessagePreviews | null>(null);

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
    const messages: MessagePreviews = [
      createMessage(messageText, "user"),
      createMessage("", "bot"),
    ];

    setMessagePreviews(messages);

    return messages;
  };

  // Combine les messages existants avec les aperçus optimistes si nécessaire
  const allMessages = isSendingMessage
    ? [...conversation.messages, ...messagePreviews]
    : conversation.messages;

  return { allMessages, createOptimisticMessages };
}
