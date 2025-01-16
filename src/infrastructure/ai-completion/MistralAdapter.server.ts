import { invariantResponse } from "@epic-web/invariant";
import { Mistral } from "@mistralai/mistralai";
import type { ChatCompletion } from "~/domain/ports/ChatCompletion.server";
import type { Conversation } from "~/domain/types";

export class MistralAdapter implements ChatCompletion {
  private apiKey = process.env.MISTRAL_API_KEY;
  private client = new Mistral({ apiKey: this.apiKey });
  private roleMap = {
    user: "user",
    bot: "assistant",
  } as const;

  async generateResponse(
    conversation: Conversation,
    userMessage: string
  ): Promise<string> {
    const oldMessages = conversation.messages.map((message) => ({
      content: message.content,
      role: this.roleMap[message.sender],
    }));

    const chatResponse = await this.client.chat.complete({
      model: "mistral-small-latest",
      messages: [
        ...oldMessages,
        {
          content: userMessage,
          role: "user",
        },
      ],
    });

    invariantResponse(
      chatResponse.choices !== undefined && chatResponse.choices.length > 0,
      "No choices returned in chat response"
    );

    const result = chatResponse.choices[0].message.content;

    invariantResponse(
      typeof result === "string",
      "API did not return a string"
    );

    return result;
  }
}
