import { PrismaClient } from "@prisma/client";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

declare global {
  var prisma: PrismaClient | undefined;
}

export const createClient = () => {
  if (global.prisma) {
    return global.prisma;
  }
  // Keep one consistent db file path when DATABASE_URL is missing in app env.
  const defaultDatabasePath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../dev.db",
  );
  const URL = process.env.DATABASE_URL || pathToFileURL(defaultDatabasePath).toString();

  const prisma = new PrismaClient({
    datasourceUrl: URL,
  });

  global.prisma = prisma;
  return prisma;
};

export const client = {
  get db() {
    return createClient();
  },
};
