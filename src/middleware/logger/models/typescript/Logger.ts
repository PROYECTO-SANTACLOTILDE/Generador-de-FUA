// Imported libraries
import { LogSequelize } from "../sequelize";
import { Logger_EnvironmentType } from "./EnvironmentType";
import { Log } from "./Log";
import * as fs from "fs";
import * as path from "path";

// Interfaces



// Class (Atributes)



// Methods



// Export Methods


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


export class LoggerInstance {
    public enviroment: Logger_EnvironmentType;
    private name: string;

  constructor(
    enviroment: Logger_EnvironmentType,
    name: string
  ) {
    this.enviroment = enviroment;
    this.name = name;
  }

  // Methods
  testTerminal(log : Log) {
    let message = 'Message Failed. \n';
    message = log.toTerminal();
    console.log( message );
  }

  testFile(path : string, log : Log) {
    try {
        if (!fs.existsSync(path)) {
            let notFoundFileMessage = `[${(new Date).toISOString()}] File named '${path}' couldn't be found. Logger created the file. \n`;
            fs.appendFileSync(path, notFoundFileMessage, { encoding: "utf-8" }); 
        }
        const message = log.toFile();
        fs.appendFileSync(path, message, { encoding: "utf-8" });
    } catch (err) {
      console.error("Failed to write log file: ", err);
    }
  };

  async testDB(log : Log){
    try {
      let aux = await LogSequelize.create({
        timeStamp: log.timeStamp,
        logLevel: log.logLevel.toString(),
        securityLevel: log.securityLevel.toString(),
        logType: log.logType.toString(),
        description: log.description,
        content: JSON.stringify(log.content)
      });
    }catch(error : any){
      console.error("Failed to write log file: ", error);
    }    
  };

  public printLog(log: Log, targets: TargetSpec[]) {
    for (const t of targets) {
      try {
        if (t.name === "terminal") {
          this.testTerminal(log);
        } 
        else if (t.name === "file") {
          if (!t.file || typeof t.file !== "string" || t.file.trim() === "") {
            console.error("Invalid file path.");
            continue;
          }
          ensureParentDir(t.file);
          this.testFile(t.file, log);
        } 
        else if (t.name === "database") {
          this.testDB(log);
        } 
        else {
          console.error(`Unknown target: ${(t as any).name}`);
        }
      } catch (err) {
        console.error(`Failed to log in target ${t.name}:`, err);
      }
    }
  }

}


