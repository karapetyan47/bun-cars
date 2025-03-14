import { initPrisma } from '@/core/db/prisma.db';
import initRoutes from '@/routes/index';
import type { Exception } from '@/core/exceptions';
import '@/core/types.d.ts';

const PORT = Bun.env.PORT || 5000;

async function bootstrap() {
  try {
    const prismaClient = await initPrisma();
    const routes = initRoutes(prismaClient);

    const server = Bun.serve({
      port: PORT,
      hostname: 'localhost',
      development: Bun.env.MODE === 'DEVELOPMENT',
      routes,
      fetch: () => new Response('Not Found', { status: 404 }),
      error: (error: Error | Exception) => {
        const message = error.message || 'Internal Server Error';
        const status = (error as Exception).statusCode || 500;
        return new Response(message, { status });
      },
    });

    console.log(`Server running on ${server.hostname}:${server.port}`);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

bootstrap();
