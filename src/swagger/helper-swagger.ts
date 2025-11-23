import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

export interface SwaggerOptions {
    title: string;
    description: string;
    version: string;
    modules: any[];
}

export function createSwaggerDocument(app: INestApplication, options: SwaggerOptions): OpenAPIObject {
    const config = new DocumentBuilder()
        .setTitle(options.title)
        .setDescription(options.description)
        .setVersion(options.version)
        .build();

    return SwaggerModule.createDocument(app, config, {
        include: options.modules,
    });
}
