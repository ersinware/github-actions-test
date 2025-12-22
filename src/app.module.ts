import { Module, ValidationPipe } from '@nestjs/common';
import { APP_PIPE } from '@nestjs/core';
import { HealthModule } from './health/health.module';
import { CatsModule } from './v1/cats/cats.module';
import { CatsModuleV2 } from './v2/cats/cats.module';

@Module({
  imports: [CatsModule, CatsModuleV2, HealthModule],
  providers: [
    {
      // NestJS'e "Bu sağlayıcıyı tüm uygulama için Global Pipe olarak kullan" diyoruz.
      provide: APP_PIPE,
      // Request ➝ Middleware ➝ Guards ➝ Interceptors ➝ Pipes ➝ Controller
      useValue: new ValidationPipe({
        // 1. Güvenlik Duvarı (Fazlalık veriyi engelle)
        whitelist: true,
        forbidNonWhitelisted: true,
        forbidUnknownValues: true,

        // 2. Bilgi Sızıntısı Önleme (Hata mesajlarını temizle)
        validationError: {
          target: false, // Gönderilen objeyi hata mesajında geri dönme
          value: false, // Hatalı değeri hata mesajında geri dönme
        },

        // 3. Veri Dönüştürme
        transform: true, // Gelen JSON'ı otomatik DTO instance'ına çevirir
      }),
    },
  ],
})
export class AppModule {}
