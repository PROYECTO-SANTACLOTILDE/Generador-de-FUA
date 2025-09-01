// Imported libraries

import { randomUUID } from 'crypto';

/* import {Logger_EnvironmentType} from './EnvironmentType';
import {Logger_LogLevel} from './LogLevel';
import {Logger_LogType} from './LogType';
import {Logger_SecurityLevel} from './SecurityLevel'; */


import {Logger_LogType} from './LogType';
import {Logger_EnvironmentType} from './EnvironmentType';
import {Logger_LogLevel} from './LogLevel';
import {Logger_SecurityLevel} from './SecurityLevel';


// Interfaces




// Class (Atributes)
export class Log {
  private static _counter = 0;
  
    // 
  readonly id?: number;
  readonly uuid?: string;
  timeStamp : Date;
  logLevel: Logger_LogLevel;
  securityLevel: Logger_SecurityLevel;
  logType: Logger_LogType;
  environmentType: Logger_EnvironmentType;
  description?: string;         // short human message
  content?: unknown;            // any structured payload

  constructor(params: {
    id: number;
    uuid: string;
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
  toTerminal() {
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

    finalString += this.logLevel.padEnd(50,'_');

    finalString += White    + this.timeStamp.toISOString().padStart(20,' ')  + Reset + " ";
    finalString += Cyan     + this.logLevel.padStart(15, ' ')                + Reset + " ";
    finalString += Magenta  + this.securityLevel.padStart(20, ' ')           + Reset + " ";
    finalString += White    + this.logType.padStart(30,' ')                  + Reset + " ";
    finalString += White    + this.description?.padStart(100, ' ')           + Reset + '\n ';

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


type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';



export type LogRecord = {
  level: LogLevel;
  msg: string;
  time?: number;                // epoch ms
  trace_id?: string;
  user_id?: string;
  role?: string;
  service?: string;
  [k: string]: any;             // extra fields
};

interface Sink {
  write(rec: LogRecord): Promise<void>;
  healthy?(): boolean;
}

class ConsoleSink implements Sink {
  async write(rec: LogRecord) {
    // never throw: worst case, swallow
    try {
      const line = JSON.stringify({ time: Date.now(), ...rec });
      (rec.level === 'error' || rec.level === 'fatal' ? process.stderr : process.stdout).write(line + '\n');
    } catch { /* swallow */ }
  }
}

class LoggerInstance {
  private sinks: Sink[] = [];
  private base: Record<string, any>;

  constructor(base: Record<string, any>, sinks: Sink[]) {
    this.base = base;
    this.sinks = sinks.length ? sinks : [new ConsoleSink()];
  }

  child(bindings: Record<string, any>) {
    return new LoggerInstance({ ...this.base, ...bindings }, this.sinks);
  }

  // Never throw outward
  async log(level: LogLevel, msg: string, fields: Record<string, any> = {}) {
    const rec: LogRecord = { level, msg, ...this.base, ...fields, time: Date.now() };
    // fan-out, but don’t await all sequentially; tolerate individual sink failures
    await Promise.all(this.sinks.map(s => s.write(rec).catch(() => {})));
  }

  debug(m: string, f?: any) { return this.log('debug', m, f); }
  info (m: string, f?: any) { return this.log('info' , m, f); }
  warn (m: string, f?: any) { return this.log('warn' , m, f); }
  error(m: string, f?: any) { return this.log('error', m, f); }
  fatal(m: string, f?: any) { return this.log('fatal', m, f); }
}

// --- Singleton + static facade ---
let _instance: LoggerInstance | null = null;

export function initLogger(base: Record<string, any>, sinks: Sink[] = []) {
  _instance = new LoggerInstance(base, sinks);
  return _instance;
}
export function getLogger() {
  if (!_instance) _instance = new LoggerInstance({ service: 'app' }, [new ConsoleSink()]);
  return _instance!;
}

// Static-looking facade (never throws)
export const Logger = {
  child: (b: Record<string, any>) => getLogger().child(b),
  debug: (m: string, f?: any) => getLogger().debug(m, f),
  info:  (m: string, f?: any) => getLogger().info (m, f),
  warn:  (m: string, f?: any) => getLogger().warn (m, f),
  error: (m: string, f?: any) => getLogger().error(m, f),
  fatal: (m: string, f?: any) => getLogger().fatal(m, f),
};