import { INestApplication, Type } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export interface SwaggerOptions {
  title: string;
  description: string;
  version: string;
  modules: Type<any>[];
}

export function createSwaggerDocument(
  app: INestApplication,
  options: SwaggerOptions,
): OpenAPIObject {
  const config = new DocumentBuilder()
    .setTitle(options.title)
    .setDescription(options.description)
    .setVersion(options.version)
    .addServer('http://localhost:3000', 'Development server')
    .setContact(
      'API Support',
      'https://example.com/support',
      'support@example.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .addTag('cats', 'Operations related to cats')
    .build();

  return SwaggerModule.createDocument(app, config, {
    include: options.modules,
  });
}
