import { ConnectionOptions, Connection, createConnection } from 'typeorm';

import Console from './Console';

class Database {
  private options: ConnectionOptions;

  private console: Console;

  constructor(options: ConnectionOptions) {
    this.options = options;
    this.console = new Console('DB');
  }

  async createConnection(): Promise<Connection | null> {
    try {
      this.console.success('Connecting to database ...');
      const connection = await createConnection({
        ...this.options,
        entities: [`${__dirname}/../entities/*.${process.env.NODE_ENV === 'production' ? 'js' : 'ts'}`],
        synchronize: true,
      });
      this.console.success('Connected to database');
      return connection;
    } catch (e) {
      this.console.error((e as Error).message);
      setTimeout(() => this.createConnection(), 5000);
      return null;
    }
  }
}
export default Database;
