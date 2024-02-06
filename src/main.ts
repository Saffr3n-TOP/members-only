import app from './app';
import Debug from 'debug';
import http from 'http';

const debug = Debug('members-only:server');
const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
const server = http.createServer(app);

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

function onError(err: NodeJS.ErrnoException) {
  if (err.syscall !== 'listen') {
    throw err;
  }

  const bind = `Port ${port}`;

  switch (err.code) {
    case 'EACCES':
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw err;
  }
}

function onListening() {
  debug(`Listening on port ${port}`);
}
