import { ChatService } from "~/application/chat-service.server";
import { StorageService } from "~/application/storage-service.server";

import { MistralAdapter } from "~/infrastructure/completion/MistralAdapter.server";
import { NodePersistAdapter } from "~/infrastructure/persistence/NodePersistAdapter.server";

/**
 * Configure and initialize all services with their concrete adapter implementations.
 * This is the only place where the application should directly reference concrete implementations.
 */
export function initializeServices(): void {
  // Initialize storage service with persistence adapter
  StorageService.initialize(new NodePersistAdapter());

  // Initialize chat service with completion adapter
  ChatService.initialize(new MistralAdapter());
}
