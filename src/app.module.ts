import { Module } from '@nestjs/common';
import { CatsModule } from './v1/cats/cats.module';
import { CatsModuleV2 } from './v2/cats/cats.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [CatsModule, CatsModuleV2, HealthModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
