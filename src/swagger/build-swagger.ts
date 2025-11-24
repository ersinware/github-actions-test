import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { CatsModule } from '../v1/cats/cats.module';
import { CatsModuleV2 } from '../v2/cats/cats.module';
import * as fs from 'fs';
import { createSwaggerDocument } from './helper-swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const document = createSwaggerDocument(app, {
    title: 'API Documentation',
    description: 'Detailed documentation for this API',
    version: '1.0.0',
    modules: [CatsModule],
  });
  fs.writeFileSync('./dist/swagger-v1.json', JSON.stringify(document, null, 2));

  const documentV2 = createSwaggerDocument(app, {
    title: 'API Documentation V2',
    description: 'Detailed documentation for this API V2',
    version: '2.0.0',
    modules: [CatsModuleV2],
  });
  fs.writeFileSync(
    './dist/swagger-v2.json',
    JSON.stringify(documentV2, null, 2),
  );
}

bootstrap()
  .then(() => {
    console.log('Swagger generated successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error in while creating Swagger:', error);
    process.exit(1);
  });
