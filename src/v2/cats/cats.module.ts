import { Module } from '@nestjs/common';
import { CatsControllerV2 } from './cats.controller';
import { CatsService } from './cats.service';

@Module({
  controllers: [CatsControllerV2],
  providers: [CatsService],
})
export class CatsModuleV2 {}
