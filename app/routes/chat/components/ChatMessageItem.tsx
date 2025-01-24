import {
  ChatBubble,
  ChatBubbleMessage,
} from "~/components/ui/chat/chat-bubble";
import type { Message } from "~/domain/types";

export function ChatMessageItem({ message }: { message: Message }) {
  return (
    <ChatBubble variant={message.sender === "user" ? "sent" : "received"}>
      <ChatBubbleMessage
        className="flex flex-col gap-2"
        isLoading={message.sender === "bot" && message.content === ""}
      >
        <div>{message.content}</div>
        <div className="text-xs text-muted-foreground">
          {message.timestamp.toLocaleString()}
        </div>
      </ChatBubbleMessage>
    </ChatBubble>
  );
}
