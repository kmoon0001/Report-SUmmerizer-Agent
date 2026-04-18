declare module 'better-sqlite3' {
  interface Database {
    prepare(sql: string): Statement;
    exec(sql: string): this;
    close(): this;
    pragma(source: string, simplify?: boolean): (...args: any[]) => any;
    transaction<T extends (...args: any[]) => any>(fn: T): T;
  }

  interface Statement {
    run(...params: any[]): RunResult;
    get(...params: any[]): any;
    all(...params: any[]): any[];
    iterate(...params: any[]): IterableIterator<any>;
    pluck(toggle?: boolean): this;
    expand(toggle?: boolean): this;
    raw(toggle?: boolean): this;
    bind(...params: any[]): this;
    columns(): ColumnDefinition[];
  }

  interface RunResult {
    changes: number;
    lastInsertRowid: number | bigint;
  }

  interface ColumnDefinition {
    name: string;
    column: string | null;
    table: string | null;
    database: string | null;
    type: string | null;
  }

  interface Options {
    readonly?: boolean;
    fileMustExist?: boolean;
    timeout?: number;
    verbose?: (message?: any, ...additionalArgs: any[]) => void;
    nativeBinding?: string;
  }

  interface DatabaseConstructor {
    new (filename: string, options?: Options): Database;
    (filename: string, options?: Options): Database;
    prototype: Database;
  }

  const Database: DatabaseConstructor;
  export default Database;
}
