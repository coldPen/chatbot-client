import type { z } from "zod";
import { messageSchema, conversationSchema } from "~/domain/schemas";

export type Message = z.infer<typeof messageSchema>;

export type Conversation = z.infer<typeof conversationSchema>;
