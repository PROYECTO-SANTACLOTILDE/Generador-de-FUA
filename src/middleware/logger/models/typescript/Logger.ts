// Imported libraries
import { LogSequelize } from "../sequelize";
import { Logger_EnvironmentType } from "./EnvironmentType";
import { Log } from "./Log";
import * as fs from "fs";

// Interfaces



// Class (Atributes)



// Methods



// Export Methods

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
  }
}