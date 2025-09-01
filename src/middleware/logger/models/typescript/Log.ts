// logger.ts
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