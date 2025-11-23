"use server";

import { db } from "@/lib/db";
// Ensure database is initialized
import "@/lib/db/init";
import type { Log, LogType, LogSeverity } from "@/lib/db/types";

export async function getLogs() {
  return db.getAllLogs();
}

export async function getLogsByType(type: LogType) {
  return db.getLogsByType(type);
}

export async function getLogsBySource(source: string) {
  return db.getLogsBySource(source);
}

export async function createLog(data: {
  type: LogType;
  source: string;
  message: string;
  rawMessage?: string;
  data?: Record<string, unknown>;
  severity?: LogSeverity;
}) {
  const log = db.createLog({
    ...data,
    data: data.data || {},
    severity: data.severity || "info",
  });
  return log;
}
