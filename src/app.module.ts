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
        // HTTP protokolünde URL üzerinden gelen her şey String'dir.
        // URL: /items?id=123
        // Controller'a gelen: id değişkeni "123" (String) olur.
        // DTO'da: id: number desen bile, çalışma zamanında (runtime) o hala bir String'dir. @IsInt() validasyonu hata verir.
        // Çözüm: @Type(() => Number) // <--- Gelen string'i Number'a çevir
        // Her yere tek tek @Type(() => Number) yazmak yorucu olabilir. ValidationPipe'ın gizli bir silahı vardır: enableImplicitConversion.
        transformOptions: {
          enableImplicitConversion: true, // TypeScript tipine bakarak otomatik çevirir
        },
      }),
    },
  ],
})
export class AppModule {}
