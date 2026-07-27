import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';

const app = next({ dev: false, dir: __dirname });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer((req, res) => {
    const parsedUrl = parse(req.url, true);
    handle(req, res, parsedUrl);
  }).listen(3000, '127.0.0.1', () => {
    console.log('> Ready on http://127.0.0.1:3000');
  });
});
