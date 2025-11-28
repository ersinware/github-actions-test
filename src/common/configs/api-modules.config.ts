// WARNING: This file must ONLY be imported in 'scripts/build-swagger.ts'.
// Importing it within application code (e.g., Controllers, Services) will cause Circular Dependency errors due to module imports.

import { Type } from '@nestjs/common';
import { HealthModule } from 'src/health/health.module';
import { CatsModule } from 'src/v1/cats/cats.module';
import { CatsModuleV2 } from 'src/v2/cats/cats.module';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const VERSION_MODULE_MAP: Record<string, Type<any>[]> = {
  '1': [CatsModule],
  '2': [CatsModuleV2],
};

export const SHARED_MODULES = [HealthModule];
