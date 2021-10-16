import express, { Express } from 'express';

import Console from './lib/Console';
import Router from './routes/Routes';
import Database from './lib/Database';
import env from './utils/Config';

class Server {
  private server: Express;

  private dbConnection: Database;

  private console: Console = new Console('SERVER');

  constructor() {
    this.server = express();
    this.dbConnection = new Database(env.db);
  }

  private applyMiddleware(): void {
    this.console.success('Applying middleware...');
    this.server.use(express.json());
  }

  private setupRoutes(): void {
    this.console.success('Setting up routes ...');
    Router(this.server);
  }

  async init(): Promise<void> {
    try {
      this.console.success('Initializing server...');
      this.applyMiddleware();
      this.setupRoutes();
      await this.dbConnection.createConnection();
      this.console.success('Server initialized');
      this.server.listen(env.api.port, () => {
        this.console.success(`Server is running on port ${env.api.port}`);
      });
    } catch (e) {
      this.console.error((e as Error).message);
    }
  }
}

const server = new Server();
server.init();
