import * as fs from 'fs';
import { NestFactory } from '@nestjs/core';
import { VersioningType, INestApplication, Type } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '../app.module';
import { CatsModule } from '../v1/cats/cats.module';
import { CatsModuleV2 } from '../v2/cats/cats.module';
import { HealthModule } from '../health/health.module';

interface SwaggerTag {
  name: string;
  description: string;
}

interface SwaggerConfig {
  version: string;
  modules: Type<any>[];
  filename: string;
  title?: string;
  tags?: SwaggerTag[];
}

const configs: SwaggerConfig[] = [
  {
    version: '1.0.0',
    modules: [HealthModule, CatsModule],
    filename: 'swagger-v1.json',
    title: 'API Documentation V1',
    tags: [
      { name: 'health', description: 'System health check endpoints' },
      { name: 'cats', description: 'Operations related to cats management' },
    ],
  },
  {
    version: '2.0.0',
    modules: [HealthModule, CatsModuleV2],
    filename: 'swagger-v2.json',
    title: 'API Documentation V2',
    tags: [
      { name: 'health', description: 'System health check endpoints' },
      { name: 'cats', description: 'Operations related to cats management' },
    ],
  },
];

function generateDocument(app: INestApplication, config: SwaggerConfig) {
  const builder = new DocumentBuilder()
    .setTitle(config.title || 'API Documentation')
    .setDescription(`Detailed documentation for API ${config.version}`)
    .setVersion(config.version)
    .addServer('http://localhost:3000', 'Development server')
    .setContact(
      'API Support',
      'https://example.com/support',
      'support@example.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT');

  if (config.tags) {
    config.tags.forEach((tag) => builder.addTag(tag.name, tag.description));
  }

  const options = builder.build();

  return SwaggerModule.createDocument(app, options, {
    include: config.modules,
  });
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  for (const config of configs) {
    const document = generateDocument(app, config);
    const path = `./dist/${config.filename}`;

    if (!fs.existsSync('./dist')) {
      fs.mkdirSync('./dist');
    }

    fs.writeFileSync(path, JSON.stringify(document, null, 2));
    console.log(`Generated: ${config.filename}`);
  }

  await app.close();
  process.exit(0);
}

bootstrap().catch((err) => {
  console.error('Error:', err);
  process.exit(1);
});
