import type { Message } from "~/domain/types";

/**
 * Crée un nouveau message avec les informations fournies.
 * @param content Le contenu du message.
 * @param sender L'expéditeur du message ("user" ou "bot").
 * @param options Options supplémentaires pour le message (id et timestamp).
 * @returns Le message créé.
 */
export function createMessage<S extends Message["sender"]>(
  content: string,
  sender: S,
  options?: {
    id?: string;
    timestamp?: Date;
  }
): Message & { sender: S } {
  return {
    id: options?.id ?? crypto.randomUUID(),
    content,
    sender,
    timestamp: options?.timestamp ?? new Date(),
  };
}
