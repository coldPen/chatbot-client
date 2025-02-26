import { invariant, invariantResponse } from "@epic-web/invariant";
import { AnimatePresence } from "motion/react";
import {
  type ChangeEventHandler,
  type FormEventHandler,
  type KeyboardEventHandler,
  useState,
} from "react";
import { useFetcher } from "react-router";

import { ChatService } from "~/application/chat-service.server";
import { StorageService } from "~/application/storage-service.server";
import { ChatMessageList } from "~/infrastructure/presentation/components/ui/chat/chat-message-list";
import { cn } from "~/infrastructure/presentation/lib/utils";
import { useOptimisticUpdates } from "~/infrastructure/presentation/routes/chat/hooks/useOptimisticUpdates";

import { AnimatedChatBubbleWrapper } from "./components/AnimatedChatBubbleWrapper";
import { ChatMessageItem } from "./components/ChatMessageItem";
import { MessageForm } from "./components/MessageForm";
import { ResetChatButton } from "./components/ResetChatButton";

import type { Route } from ".react-router/types/src/infrastructure/presentation/routes/chat/+types/chat";

export function meta() {
  return [
    { title: "True Chatbot" },
    { name: "description", content: "True Chatbot!" },
  ];
}

export async function loader() {
  const conversation = await StorageService.getConversation();
  return { conversation };
}

/**
 * Gère les actions côté client de la conversation.
 * Deux types d'actions sont possibles :
 * - send-message : Envoie un nouveau message dans la conversation
 * - reset-chat : Réinitialise complètement la conversation
 */
export async function action({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();

  const actionType = formData.get("actionType");

  invariantResponse(
    typeof actionType === "string",
    "actionType must be a string",
  );

  switch (actionType) {
    case "send-message": {
      const message = formData.get("message");
      invariantResponse(
        typeof message === "string",
        "message must be a string",
      );

      if (message.trim() === "") return;

      const messageId = formData.get("messageId");
      invariantResponse(
        typeof messageId === "string",
        "messageId must be a string",
      );

      const messageTimestamp = formData.get("messageTimestamp");
      invariantResponse(
        typeof messageTimestamp === "string",
        "messageTimestamp must be a string",
      );

      const responseId = formData.get("responseId");
      invariantResponse(
        typeof responseId === "string",
        "responseId must be a string",
      );

      await ChatService.sendMessage(
        {
          id: messageId,
          content: message,
          timestamp: new Date(messageTimestamp),
          sender: "user",
        },
        responseId,
      );

      break;
    }

    case "reset-chat": {
      await StorageService.resetConversation();
      break;
    }

    default: {
      // On peut "jeter" une réponse pour qu'elle soit affichée au client via ErrorBoundary
      throw new Response(`Invalid action type "${actionType}"`, {
        status: 400,
      });
    }
  }
}

/**
 * Composant principal de chat qui gère l'interface de conversation.
 * Utilise un système d'optimistic UI pour afficher les messages immédiatement
 * avant la confirmation du serveur.
 */
export default function Chat({
  loaderData: { conversation },
}: Route.ComponentProps) {
  const fetcher = useFetcher();

  const { allMessages, createOptimisticMessages } = useOptimisticUpdates({
    formData: fetcher.formData,
    conversation,
  });

  // État local pour le contenu du message en cours de saisie
  const [messageContent, setMessageContent] = useState("");

  // Gère les changements dans le champ de saisie
  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setMessageContent(e.currentTarget.value);
  };

  // 1. Ajoute au formulaire les données nécessaires à la création du message
  //    (le timestamp ne peut être généré que lors de l'envoi du message)
  // 2. Vide le contenu du message lorsqu'il est envoyé
  const optimisticSubmit = (form: HTMLFormElement) => {
    const formData = new FormData(form);

    const messageText = formData.get("message");
    invariant(typeof messageText === "string", "message must be a string");

    const [userMessage, botMessage] = createOptimisticMessages(messageText);

    formData.set("messageId", userMessage.id);
    formData.set("messageTimestamp", userMessage.timestamp.toISOString());

    formData.set("responseId", botMessage.id);

    fetcher.submit(formData, { method: "post" });

    setMessageContent("");
  };

  // Gère les touches spéciales (notamment Entrée pour envoyer)
  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();

      const form = e.currentTarget.form;
      if (!form) {
        return;
      }

      optimisticSubmit(form);
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const form = e.currentTarget;

    optimisticSubmit(form);
  };

  // Détermine si la conversation contient des messages (incluant les messages optimistes)
  const chatIsNotEmpty = allMessages.length > 0;

  return (
    <div
      className={cn(
        "grid h-screen",
        chatIsNotEmpty ? "grid-rows-[auto_1fr_auto]" : "grid-rows-[1fr_auto]",
      )}
    >
      {chatIsNotEmpty && <ResetChatButton />}

      <div className="flex-1 w-full overflow-y-auto bg-muted/40">
        <ChatMessageList>
          <AnimatePresence initial={false}>
            {allMessages.map((message, index) => (
              <AnimatedChatBubbleWrapper key={message.id} index={index}>
                <ChatMessageItem message={message} />
              </AnimatedChatBubbleWrapper>
            ))}
          </AnimatePresence>
        </ChatMessageList>
      </div>

      <div className="px-4 pb-4 bg-muted/40">
        <MessageForm
          messageContent={messageContent}
          onMessageChange={handleChange}
          onKeyDown={handleKeyDown}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  );
}
