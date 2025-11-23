import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO'da tanımlı olmayan property'leri otomatik temizler (Security)
      forbidNonWhitelisted: true, // Fazla property gelirse hata fırlatır,
      transform: true, // <-- Bunu eklemek veri güvenliği ve tutarlılığı sağlar
    }),
  );

  // 1. Versioning'i aktif et
  app.enableVersioning({
    type: VersioningType.URI, // URI tabanlı versiyonlama (örn: /v1/...)
    defaultVersion: '1', // Varsayılan versiyon (isteğe bağlı)
    // prefix: 'v',           // Varsayılan prefix 'v'dir, değiştirmek istersen burayı açabilirsin.
  });

  // Opsiyonel: Global bir prefix eklemek istersen (örn: api/v1/...)
  // app.setGlobalPrefix('api');

  await app.listen(3000);
}

bootstrap()
  .catch((err) => {
    console.error('Error during application bootstrap:', err);
  });