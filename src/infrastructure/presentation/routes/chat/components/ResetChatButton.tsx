import { Trash } from "lucide-react";
import { useFetcher } from "react-router";

import { Button } from "~/infrastructure/presentation/components/ui/button";

export function ResetChatButton() {
  const fetcher = useFetcher();
  return (
    <fetcher.Form
      method="post"
      className="p-4 flex items-center justify-center shadow"
    >
      <input type="hidden" name="actionType" value="reset-chat" />

      <Button type="submit" className=" shadow-lg" variant="outline">
        <Trash /> Réinitialiser la conversation
      </Button>
    </fetcher.Form>
  );
}
