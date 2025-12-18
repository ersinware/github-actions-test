import { VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //     forbidNonWhitelisted: true,
  //     transform: true,
  //   }),
  // );

  // Varsayılan olarak NestJS (performans için) kapanma sinyallerini dinlemez
  // BU SATIR ÇOK ÖNEMLİ!
  // SIGTERM veya SIGINT geldiğinde NestJS'in kapanma sürecini tetikler.
  app.enableShutdownHooks();

  await app.listen(3000, '0.0.0.0');
}

bootstrap().catch((err) => {
  console.error('Error during application bootstrap:', err);
});
