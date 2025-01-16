import { ChatMessageList } from "~/components/ui/chat/chat-message-list";
import type { Route } from "./+types/home";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "~/components/ui/chat/chat-bubble";
import { ChatInput } from "~/components/ui/chat/chat-input";
import { Button } from "~/components/ui/button";
import { CornerDownLeft, Mic, Paperclip } from "lucide-react";
import { useFetcher, useSubmit } from "react-router";
import { invariantResponse } from "@epic-web/invariant";
import { StorageService } from "~/storage-service";
import { ChatService } from "~/chat-service";
import { useState, type FormEventHandler } from "react";

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

  await ChatService.sendMessage(message);
}

export default function Home({
  loaderData: { conversation },
}: Route.ComponentProps) {
  const fetcher = useFetcher();

  const submit = useSubmit();

  const [messageContent, setMessage] = useState("");

  const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
  };

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex-1 w-full overflow-y-auto bg-muted/40">
        <ChatMessageList>
          {conversation.messages.map((message) => (
            <ChatBubble
              key={message.id}
              variant={message.sender === "user" ? "sent" : "received"}
            >
              <ChatBubbleMessage isLoading={fetcher.state !== "idle"}>
                {message.content}
              </ChatBubbleMessage>
            </ChatBubble>
          ))}
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
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tapez votre message..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center p-3 pt-0">
            {/* <Button variant="ghost" size="icon">
              <Paperclip className="size-4" />
              <span className="sr-only">Attach file</span>
            </Button>

            <Button variant="ghost" size="icon">
              <Mic className="size-4" />
              <span className="sr-only">Use Microphone</span>
            </Button> */}

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
