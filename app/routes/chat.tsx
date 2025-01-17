import { CornerDownLeft, Trash } from "lucide-react";
import { useFetcher } from "react-router";
import { invariantResponse } from "@epic-web/invariant";
import {
  useState,
  type ChangeEventHandler,
  type FormEventHandler,
  type KeyboardEventHandler,
} from "react";

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

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Fake Chatbot" },
    { name: "description", content: "Welcome to Fake Chatbot!" },
  ];
}

export async function clientLoader({ request }: Route.ClientLoaderArgs) {
  const conversation = StorageService.getConversation();

  return { conversation };
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
    case "send-message":
      const message = formData.get("message");
      invariantResponse(
        typeof message === "string",
        "message must be a string"
      );
      if (message.trim() === "") return;
      await ChatService.sendMessage(message);
      // Pas besoin de renvoyer un payload: la route est revalidée après l'action, donc la conversation est actualisée
      break;
    case "reset-chat":
      StorageService.resetConversation();
      break;
    default:
      // On peut "jeter" une réponse pour qu'elle soit affichée au client via ErrorBoundary
      throw new Response("Invalid action type", { status: 400 });
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

  let optimisticMessagePreview = null;
  if (fetcher.formData) {
    const message = fetcher.formData.get("message");
    if (typeof message === "string") {
      optimisticMessagePreview = message;
    }
  }

  // État local pour le contenu du message en cours de saisie
  const [messageContent, setMessageContent] = useState("");

  // Gère les changements dans le champ de saisie
  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setMessageContent(e.currentTarget.value);
  };

  // Gère les touches spéciales (notamment Entrée pour envoyer)
  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setMessageContent("");
      fetcher.submit(e.currentTarget.form);
    }
  };

  // Vide le contenu du message lorsqu'il est envoyé
  const handleSubmit: FormEventHandler<HTMLFormElement> = () => {
    setMessageContent("");
  };

  // Détermine si la conversation contient des messages (incluant les messages optimistes)
  const chatIsNotEmpty =
    conversation.messages.length > 0 || optimisticMessagePreview !== null;

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
          {conversation.messages.map((message) => (
            <ChatBubble
              key={message.id}
              variant={message.sender === "user" ? "sent" : "received"}
            >
              <ChatBubbleMessage className="flex flex-col gap-2">
                <div>{message.content}</div>
                <div className="text-xs text-muted-foreground">
                  {message.timestamp.toLocaleString()}
                </div>
              </ChatBubbleMessage>
            </ChatBubble>
          ))}

          {optimisticMessagePreview && (
            <>
              <ChatBubble variant="sent">
                <ChatBubbleMessage>
                  {optimisticMessagePreview}
                </ChatBubbleMessage>
              </ChatBubble>
              <ChatBubble variant="received">
                <ChatBubbleMessage isLoading={fetcher.state !== "idle"} />
              </ChatBubble>
            </>
          )}
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
