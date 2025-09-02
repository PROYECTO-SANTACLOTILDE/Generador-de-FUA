// Targets.ts
import { LoggerInstance } from "./Logger"; // <-- adapte le chemin si besoin
import { Log } from "./Log";
import * as fs from "fs";
import * as path from "path";


export type TerminalTarget = { name: "terminal" };
export type FileTarget     = { name: "file"; file: string };
export type DatabaseTarget = { name: "database" };
export type TargetSpec = TerminalTarget | FileTarget | DatabaseTarget;

export type PrintResult = {
  target: "terminal" | "file" | "database";
  ok: boolean;
  error?: string;
  path?: string; 
};

// ---- Petit helper : s'assurer que le dossier existe (pour les fichiers)
function ensureParentDir(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

/**
 * Route un log vers plusieurs cibles. Ne jette jamais d'exception vers l'appelant :
 * chaque résultat (succès/échec) est renvoyé dans le tableau de PrintResult.
 */
export async function printLog(
  logger: LoggerInstance,
  log: Log,
  targets: TargetSpec[]
): Promise<PrintResult[]> {

  const tasks = targets.map<Promise<PrintResult>>(async (t) => {
    try {
      switch (t.name) {
        case "terminal": {
          logger.testTerminal(log);
          return { target: "terminal", ok: true };
        }
        case "file": {
          if (!t.file || typeof t.file !== "string" || t.file.trim() === "") {
            return { target: "file", ok: false, error: "Missing or empty 'file' path." };
          }
        
          ensureParentDir(t.file);
          logger.testFile(t.file, log);
          return { target: "file", ok: true, path: t.file };
        }
        case "database": {
          await logger.testDB(log);
          return { target: "database", ok: true };
        }
        default:
          return { target: (t as any).name ?? "unknown", ok: false, error: "Unknown target name." };
      }
    } catch (e: any) {
      return {
        target: t.name,
        ok: false,
        error: typeof e?.message === "string" ? e.message : String(e)
      };
    }
  });

  return Promise.all(tasks);
}