import express from 'express';

import Console from './lib/Console';
import Router from './routes/Routes';

const server = express();

const PORT = 3000;

const apiConsole = new Console('SERVER');

server.use(express.json());
Router(server);

server.listen(PORT, () => {
  apiConsole.success(`Server is running on port ${PORT}`);
});
