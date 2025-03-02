import Markdown from "markdown-to-jsx";

import type { Message } from "~/domain/types";

import {
  ChatBubble,
  ChatBubbleMessage,
} from "~/infrastructure/presentation/components/ui/chat/chat-bubble";

/**
 * Composant qui affiche un message individuel dans la conversation.
 * Utilise le composant ChatBubble pour styliser différemment les messages de l'utilisateur et du bot.
 *
 * Caractéristiques :
 * - Affiche le contenu du message
 * - Affiche l'horodatage formaté selon la locale
 * - Style différent selon l'expéditeur (utilisateur/bot)
 * - État de chargement pour les réponses du bot en cours de génération
 */
export function ChatMessageItem({ message }: { message: Message }) {
  return (
    <ChatBubble variant={message.sender === "user" ? "sent" : "received"}>
      <ChatBubbleMessage
        className="flex flex-col gap-2 overflow-x-auto"
        isLoading={message.sender === "bot" && message.content === ""}
      >
        <Markdown>{message.content}</Markdown>
        <div className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleString()}
        </div>
      </ChatBubbleMessage>
    </ChatBubble>
  );
}
