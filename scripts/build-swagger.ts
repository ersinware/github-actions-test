import { INestApplication, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import { AppModule } from 'src/app.module';
import { SHARED_MODULES, VERSION_MODULE_MAP } from 'src/common/configs/api-modules.config';
import {
  ACTIVE_VERSIONS,
  TAG_DESCRIPTIONS,
  VERSION_DETAILS,
  VERSION_TAG_MAP,
} from 'src/common/configs/api-versions.config';

function generateDocument(app: INestApplication, version: string) {
  const details = VERSION_DETAILS[version] || {
    title: `API V${version}`,
    description: `API V${version} Docs`,
  };

  const versionSpecificModules = VERSION_MODULE_MAP[version] || [];
  const allModules = [...SHARED_MODULES, ...versionSpecificModules];

  const builder = new DocumentBuilder()
    .setTitle(details.title)
    .setDescription(details.description)
    .setVersion(`${version}.0.0`)
    .addServer('http://localhost:3000', 'Development server')
    .setContact(
      'API Support',
      'https://example.com/support',
      'support@example.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT');

  const tags = VERSION_TAG_MAP[version] || [];

  tags.forEach((tagKey) => {
    builder.addTag(tagKey, TAG_DESCRIPTIONS[tagKey] || '');
  });

  const options = builder.build();

  const document = SwaggerModule.createDocument(app, options, {
    include: allModules,
    operationIdFactory: (_, methodKey: string) => {
      // healthCheck_v1
      return `${methodKey}_v${version}`;
    },
  });

  // Purpose: Remove paths that belong to other versions (e.g., remove /v2/... paths from the v1 swagger file).
  Object.keys(document.paths).forEach((path) => {
    ACTIVE_VERSIONS.forEach((otherVersion) => {
      // Check against versions other than the current one
      if (otherVersion !== version) {
        // If the path starts with the prefix of another version (e.g. /v2/)
        if (path.startsWith(`/v${otherVersion}/`)) {
          delete document.paths[path]; // Remove the path from the document
        }
      }
    });
  });

  return document
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: false });

  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });

  for (const version of ACTIVE_VERSIONS) {
    if (!VERSION_MODULE_MAP[version]) {
      console.warn(`Warning: Version ${version} is active but has no module mapping. Skipping.`);

      continue;
    }

    const document = generateDocument(app, version);
    const filename = `swagger-v${version}.json`;
    const outputPath = `./dist/${filename}`;

    if (!fs.existsSync('./dist')) {
      fs.mkdirSync('./dist');
    }

    fs.writeFileSync(outputPath, JSON.stringify(document, null, 2));
    console.log(`Generated: ${filename}`);
  }

  await app.close();
  process.exit(0);
}

bootstrap().catch((err) => {
  console.error('Error generating Swagger:', err);
  process.exit(1);
});