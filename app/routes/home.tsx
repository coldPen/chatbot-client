import { ChatMessageList } from "~/components/ui/chat/chat-message-list";
import type { Route } from "./+types/home";
import {
  ChatBubble,
  ChatBubbleMessage,
} from "~/components/ui/chat/chat-bubble";
import { ChatInput } from "~/components/ui/chat/chat-input";
import { Button } from "~/components/ui/button";
import { CornerDownLeft } from "lucide-react";
import { useFetcher } from "react-router";
import { invariantResponse } from "@epic-web/invariant";
import { StorageService } from "~/storage-service";
import { ChatService } from "~/chat-service";
import {
  useState,
  type ChangeEventHandler,
  type FormEventHandler,
  type KeyboardEventHandler,
} from "react";

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

export async function clientAction({ request }: Route.ClientActionArgs) {
  const formData = await request.formData();
  const message = formData.get("message");

  invariantResponse(typeof message === "string", "message must be a string");

  if (message.trim() === "") return;

  await ChatService.sendMessage(message);
}

export default function Home({
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

  const [messageContent, setMessageContent] = useState("");

  const handleChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setMessageContent(e.currentTarget.value);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      setMessageContent("");
      fetcher.submit(e.currentTarget.form);
    }
  };

  const handleSubmit: FormEventHandler<HTMLFormElement> = () => {
    setMessageContent("");
  };

  return (
    <div className="grid grid-rows-[1fr_auto] h-screen">
      <div className="flex-1 w-full overflow-y-auto bg-muted/40">
        <ChatMessageList>
          {conversation.messages.map((message) => (
            <ChatBubble
              key={message.id}
              variant={message.sender === "user" ? "sent" : "received"}
            >
              <ChatBubbleMessage>{message.content}</ChatBubbleMessage>
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
          <ChatInput
            name="message"
            value={messageContent}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Tapez votre message..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
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
