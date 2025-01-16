import type { z } from "zod";
import { messageSchema, conversationSchema } from "~/domain/schemas";

export type Message = z.infer<typeof messageSchema>;
export type UserMessage = Message & {
  sender: "user";
};
export type BotMessage = Message & {
  sender: "bot";
};

export type Conversation = z.infer<typeof conversationSchema>;
