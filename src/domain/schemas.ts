import { z } from "zod";

export const messageSchema = z.object({
  id: z.string().uuid(),
  content: z.string().min(1),
  sender: z.union([z.literal("user"), z.literal("bot")]),
  timestamp: z
    .string()
    .datetime()
    .transform((str) => new Date(str)),
});

export const conversationSchema = z.object({
  messages: z.array(messageSchema),
});
