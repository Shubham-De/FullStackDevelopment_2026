import { PrismaClient } from "@prisma/client";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

export const createClient = () => {
  const defaultDatabasePath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../dev.db",
  );
  const URL = process.env.DATABASE_URL || pathToFileURL(defaultDatabasePath).toString();

  return new PrismaClient({
    datasourceUrl: URL,
  });
};

export const client = {
  get db() {
    return createClient();
  },
};