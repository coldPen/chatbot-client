import { CornerDownLeft } from "lucide-react";
import type {
  ChangeEventHandler,
  FormEventHandler,
  KeyboardEventHandler,
} from "react";
import { useFetcher } from "react-router";
import { Button } from "~/components/ui/button";
import { ChatInput } from "~/components/ui/chat/chat-input";

/**
 * Composant de formulaire pour la saisie et l'envoi de messages dans le chat.
 *
 * Caractéristiques :
 * - Gestion des raccourcis clavier (ex: Entrée pour envoyer)
 * - Bouton d'envoi avec icône
 */
export function MessageForm({
  messageContent,
  onMessageChange,
  onKeyDown,
  onSubmit,
}: {
  messageContent: string;
  onMessageChange: ChangeEventHandler<HTMLTextAreaElement>;
  onKeyDown: KeyboardEventHandler<HTMLTextAreaElement>;
  onSubmit: FormEventHandler<HTMLFormElement>;
}) {
  const fetcher = useFetcher();
  return (
    <fetcher.Form
      method="post"
      onSubmit={onSubmit}
      className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
    >
      <input type="hidden" name="actionType" value="send-message" />
      <ChatInput
        name="message"
        value={messageContent}
        onChange={onMessageChange}
        onKeyDown={onKeyDown}
        placeholder="Tapez votre message..."
        className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      <div className="flex items-center p-3 pt-0">
        <Button type="submit" size="sm" className="ml-auto gap-1.5">
          Envoyer <CornerDownLeft className="size-3.5" />
        </Button>
      </div>
    </fetcher.Form>
  );
}
