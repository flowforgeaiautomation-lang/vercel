
import { createServer } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function start() {
  const server = await createServer({
    configFile: join(__dirname, 'vite.config.ts'),
    root: __dirname,
    server: {
      port: 4173,
      host: true
    },
    preview: true
  });
  
  await server.listen();
  console.log('Vite preview server started!');
  server.printUrls();
}

start();
