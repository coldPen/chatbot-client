import persistence from "node-persist";
import { asyncSingleton } from "~/infrastructure/presentation/lib/singleton.server";

const storage = await asyncSingleton("storage", async () => {
  await persistence.init();
  return persistence;
});

export { storage };
