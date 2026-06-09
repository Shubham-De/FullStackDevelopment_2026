import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

export const createClient = () => {
  const url = process.env.DATABASE_URL;

  if (url && url.startsWith("libsql://")) {
    const adapter = new PrismaLibSql({ url });
    return new PrismaClient({ adapter } as any);
  }

  const defaultDatabasePath = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../dev.db",
  );
  const fileUrl = url || pathToFileURL(defaultDatabasePath).toString();
  return new PrismaClient({ datasourceUrl: fileUrl });
};

export const client = {
  get db() {
    return createClient();
  },
};