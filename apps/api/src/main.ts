import 'reflect-metadata';
import { mkdirSync } from 'node:fs';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { UPLOADS_ROOT } from './common/paths.util';
import { listLanIPv4Addresses } from './common/lan-ip.util';

const PORT = 3000;

async function bootstrap(): Promise<void> {
  mkdirSync(UPLOADS_ROOT, { recursive: true });

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({ origin: true });
  // Photos arrive as base64 JSON; the default 100kb body limit would silently reject them.
  app.useBodyParser('json', { limit: '25mb' });
  app.useStaticAssets(UPLOADS_ROOT, { prefix: '/uploads' });

  await app.listen(PORT, '0.0.0.0');
  logStartupBanner();
}

function logStartupBanner(): void {
  console.log(`API siap: http://localhost:${PORT}`);
  for (const address of listLanIPv4Addresses()) {
    console.log(`Untuk HP (EXPO_PUBLIC_API_URL): http://${address}:${PORT}`);
  }
}

bootstrap();
