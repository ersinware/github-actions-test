import { Module, ValidationPipe } from '@nestjs/common';
import { CatsModule } from './v1/cats/cats.module';
import { CatsModuleV2 } from './v2/cats/cats.module';
import { HealthModule } from './health/health.module';
import { APP_PIPE } from '@nestjs/core';

@Module({
  imports: [CatsModule, CatsModuleV2, HealthModule],
  controllers: [],
  providers: [
    {
      // NestJS'e "Bu sağlayıcıyı tüm uygulama için Global Pipe olarak kullan" diyoruz.
      provide: APP_PIPE,
      // Request ➝ Middleware ➝ Guards ➝ Interceptors ➝ Pipes ➝ Controller
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
})
export class AppModule {}
