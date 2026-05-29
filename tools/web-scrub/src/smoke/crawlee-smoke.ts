import { PlaywrightCrawler } from 'crawlee';
import { createServer } from 'node:http';

async function startLocalServer(): Promise<{ url: string; close: () => Promise<void> }> {
  return new Promise((resolve) => {
    const srv = createServer((_req, res) => {
      res.statusCode = 200;
      res.setHeader('content-type', 'text/html; charset=utf-8');
      res.end('<html><body><h1>Crawlee smoke ok</h1></body></html>');
    });
    srv.listen(0, '127.0.0.1', () => {
      const addr = srv.address();
      if (typeof addr === 'object' && addr) {
        resolve({
          url: `http://127.0.0.1:${addr.port}/`,
          close: () => new Promise<void>((r) => srv.close(() => r())),
        });
      }
    });
  });
}

async function main() {
  console.log('[crawlee-smoke] starting local http server...');
  const server = await startLocalServer();
  console.log('[crawlee-smoke] server up at', server.url);

  let pagesSeen = 0;
  const crawler = new PlaywrightCrawler({
    maxRequestsPerCrawl: 1,
    launchContext: { launchOptions: { headless: true } },
    async requestHandler({ page, log }) {
      pagesSeen += 1;
      const h1 = await page.locator('h1').innerText();
      log.info(`[crawlee-smoke] visited page with h1="${h1}"`);
    },
  });

  try {
    await crawler.run([server.url]);
  } finally {
    await server.close();
  }

  if (pagesSeen === 0) {
    console.error('[crawlee-smoke] FAIL — no pages were processed');
    process.exit(2);
  }
  console.log('[crawlee-smoke] PASS — pages=%d', pagesSeen);
}

main().catch((err) => {
  console.error('[crawlee-smoke] CRASH', err);
  process.exit(1);
});
