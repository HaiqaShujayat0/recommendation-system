import { createServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

async function start() {
  const server = await createServer({
    root,
    server: {
      host: '0.0.0.0',
      port: 3000,
      strictPort: false,
    },
  });
  await server.listen();
  server.printUrls();
}

start().catch((err) => {
  console.error('Failed to start Vite dev server:', err);
  process.exit(1);
});
