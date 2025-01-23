import { CornerDownLeft, Trash } from "lucide-react";
import { useFetcher } from "react-router";
import { invariantResponse } from "@epic-web/invariant";
import {
  useState,
  type ChangeEventHandler,
  type FormEventHandler,
  type KeyboardEventHandler,
} from "react";
import { AnimatePresence } from "motion/react";
import * as motion from "motion/react-client";

import type { Route } from "./+types/chat";

import { ChatMessageList } from "~/components/ui/chat/chat-message-list";
import {
  ChatBubble,
  ChatBubbleMessage,
} from "~/components/ui/chat/chat-bubble";
import { ChatInput } from "~/components/ui/chat/chat-input";
import { Button } from "~/components/ui/button";

import { StorageService } from "~/services/storage-service";
import { ChatService } from "~/services/chat-service";
import { cn } from "~/lib/utils";
import { useOptimisticUpdates } from "~/useOptimisticUpdates";

export function meta() {
  return [
    { title: "Fake Chatbot" },
    { name: "description", content: "Welcome to Fake Chatbot!" },
  ];
}

export async function clientLoader() {
  const conversation = StorageService.getConversation();
  // on partage la factory function "createMessage" avec le composant pour faciliter l'optimistic rendering
  const { createMessage } = ChatService;
  return { conversation, createMessage };
}

/**
 * Gère les actions côté client de la conversation.
 * Deux types d'actions sont possibles :
 * - send-message : Envoie un nouveau message dans la conversation
 * - reset-chat : Réinitialise complètement la conversation
 */
export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();

  const actionType = formData.get("actionType");

  invariantResponse(
    typeof actionType === "string",
    "actionType must be a string"
  );

  switch (actionType) {
    case "send-message": {
      const message = formData.get("message");
      invariantResponse(
        typeof message === "string",
        "message must be a string"
      );

      if (message.trim() === "") return;

      const messageId = formData.get("messageId");
      invariantResponse(
        typeof messageId === "string",
        "messageId must be a string"
      );

      const messageTimestamp = formData.get("messageTimestamp");
      invariantResponse(
        typeof messageTimestamp === "string",
        "messageTimestamp must be a string"
      );

      const responseId = formData.get("responseId");
      invariantResponse(
        typeof responseId === "string",
        "responseId must be a string"
      );

      await ChatService.sendMessage(
        {
          id: messageId,
          content: message,
          timestamp: new Date(messageTimestamp),
          sender: "user",
        },
        responseId
      );

      break;
    }

    case "reset-chat": {
      StorageService.resetConversation();
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
  loaderData: { conversation, createMessage },
}: Route.ComponentProps) {
  const fetcher = useFetcher();

  const { allMessages, createOptimisticMessages } = useOptimisticUpdates({
    formData: fetcher.formData,
    conversation,
    createMessage,
  });

  // État local pour le contenu du message en cours de saisie
  const [messageContent, setMessageContent] = useState("");

  // Gère les changements dans le champ de saisie
  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setMessageContent(e.currentTarget.value);
  };

  const optimisticSubmit = (form: HTMLFormElement) => {
    const formData = new FormData(form);

    const messageText = formData.get("message");
    invariantResponse(
      typeof messageText === "string",
      "message must be a string"
    );

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

  // 1. Ajoute au formulaire les données nécessaires à la création du message
  //    (le timestamp ne peut être généré que lors de l'envoi du message)
  // 2. Vide le contenu du message lorsqu'il est envoyé
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
        chatIsNotEmpty ? "grid-rows-[auto_1fr_auto]" : "grid-rows-[1fr_auto]"
      )}
    >
      {chatIsNotEmpty && (
        <fetcher.Form
          method="post"
          className="p-4 flex items-center justify-center shadow"
        >
          <input type="hidden" name="actionType" value="reset-chat" />

          <Button type="submit" className=" shadow-lg" variant="outline">
            <Trash /> Réinitialiser la conversation
          </Button>
        </fetcher.Form>
      )}

      <div className="flex-1 w-full overflow-y-auto bg-muted/40">
        <ChatMessageList>
          <AnimatePresence initial={false}>
            {allMessages.map((message, index) => (
              <AnimatedChatBubbleWrapper key={message.id} index={index}>
                <ChatBubble
                  variant={message.sender === "user" ? "sent" : "received"}
                >
                  <ChatBubbleMessage
                    className="flex flex-col gap-2"
                    isLoading={
                      message.sender === "bot" && message.content === ""
                    }
                  >
                    <div>{message.content}</div>
                    <div className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleString()}
                    </div>
                  </ChatBubbleMessage>
                </ChatBubble>
              </AnimatedChatBubbleWrapper>
            ))}
          </AnimatePresence>
        </ChatMessageList>
      </div>

      <div className="px-4 pb-4 bg-muted/40">
        <fetcher.Form
          method="post"
          onSubmit={handleSubmit}
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
        >
          <input type="hidden" name="actionType" value="send-message" />

          <ChatInput
            name="message"
            value={messageContent}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Tapez votre message..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
          />

          <div className="flex items-center p-3 pt-0">
            <Button type="submit" size="sm" className="ml-auto gap-1.5">
              Envoyer
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </fetcher.Form>
      </div>
    </div>
  );
}

function AnimatedChatBubbleWrapper({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 1, y: 50, x: 0 }}
      animate={{ opacity: 1, scale: 1, y: 0, x: 0 }}
      exit={{ opacity: 0, scale: 1, y: 1, x: 0 }}
      transition={{
        opacity: { duration: 0.1 },
        layout: {
          type: "spring",
          bounce: 0.3,
          duration: index * 0.05 + 0.2,
        },
      }}
      style={{ originX: 0.5, originY: 0.5 }}
      className="flex flex-col gap-2 p-4"
    >
      {children}
    </motion.div>
  );
}
