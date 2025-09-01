// Imported libraries

import { randomUUID } from 'crypto';


import {Logger_LogType} from './LogType';
import {Logger_EnvironmentType} from './EnvironmentType';
import {Logger_LogLevel} from './LogLevel';
import {Logger_SecurityLevel} from './SecurityLevel';


// Interfaces




// Class (Atributes)
export class Log {
  private static _counter = 0;
  
    
  readonly id?: number;                     // Numeric identifier
  readonly uuid?: string;                   // Globally unique identifier (UUID v4), ensures uniqueness across systems
  timeStamp : Date;                         // Exact time when the log entry was created
  logLevel: Logger_LogLevel;                // Severity of the log entry (e.g., INFO, WARN, ERROR, FATAL)
  securityLevel: Logger_SecurityLevel;      // Security classification (e.g., USER, ADMIN, SYSTEM)
  logType: Logger_LogType;                  // Type of action being logged (e.g., CREATE, READ, UPLOAD, DELETE)
  environmentType: Logger_EnvironmentType;  // Environment where the log was generated (DEV, QUALITY, PROD)
  description?: string;                     // short human message
  content?: unknown;                        // any structured payload

  constructor(params: {
    id?: number;
    uuid?: string;
    timeStamp: Date;
    logLevel: Logger_LogLevel;
    securityLevel: Logger_SecurityLevel;
    logType: Logger_LogType;
    environmentType: Logger_EnvironmentType;
    description?: string;
    content?: unknown;
  }) {
    this.id = params.id ?? -1;
    this.uuid = params.uuid ?? '---';
    this.timeStamp = params.timeStamp;
    this.logLevel = params.logLevel;
    this.securityLevel = params.securityLevel;
    this.logType = params.logType;
    this.environmentType = params.environmentType;
    this.description = params.description;
    this.content = params.content;

  }

  // In Terminal (String with jump lines)
  public toTerminal() {
    // timestamp:       20 characters, white color
    // info:            15 characters, different color
    // security level:  20, different color
    // log type:        30, white color
    // description:     100, white color
    // content:         free text with jump line, while color  

    const Reset = "\x1b[0m";
    const White = "\x1b[37m";
    const Cyan = "\x1b[36m";
    const Magenta = "\x1b[35m";
    const Yellow = "\x1b[33m";

    let finalString = "";

    

    finalString += White    + ('['+this.timeStamp.toISOString()+']').padEnd(30," ")  + Reset + " ";
    finalString += Cyan     + this.logLevel.padEnd(15, ' ')                + Reset + " ";
    finalString += Magenta  + this.securityLevel.padEnd(15, ' ')           + Reset + " ";
    finalString += White    + this.logType.padEnd(15,' ')                  + Reset + " ";
    finalString += White    + (this.description?? 'No description.').padEnd(100, ' ')           + Reset + '\n ';
    

    if (this.content) {
        finalString += White + JSON.stringify(this.content, null, 2) + Reset;
    }

    return finalString;
  };

  // In a file (String)
  toFile() {

  };

  // In database
  async toDatabase(){

  }

  // EXMAPLE AS REFERENCE
  // Convenient JSON render (stable field names)
  toJSON() {
    return {
      id: this.id,
      timestampUtc: this.timeStamp,
      logLevel: this.logLevel,
      securityLevel: this.securityLevel,
      logType: this.logType,
      environmentType: this.environmentType,
      description: this.description ?? null,
      content: this.content ?? null,
    };
  }
}




// Methods



// Export Methods
