import { Test, TestingModule } from '@nestjs/testing';
import {
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import request from 'supertest';
import { Server } from 'http'; // 1. Server tipini ekledik
import { AppModule } from './../src/app.module';

// 2. Response body için basit bir tip tanımladık (Validation hataları için)
interface ValidationResponse {
  message: string[];
  error: string;
  statusCode: number;
}

describe('CatsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    );

    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: '1',
    });

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/v1/cats (GET)', () => {
    // 3. app.getHttpServer()'ı 'Server' olarak cast ettik
    return request(app.getHttpServer() as Server)
      .get('/v1/cats')
      .expect(200)
      .expect([]);
  });

  it('/v1/cats (POST)', () => {
    return request(app.getHttpServer() as Server)
      .post('/v1/cats')
      .send({
        name: 'Gofret',
        age: 2,
        breed: 'Tekir',
      })
      .expect(201)
      .expect('This action adds a new cat');
  });

  it('/v1/cats (POST) - Validation Error', () => {
    return request(app.getHttpServer() as Server)
      .post('/v1/cats')
      .send({
        name: 'Gofret',
        // age eksik
        breed: 'Tekir',
        extraField: 'Bunu kabul etmemeli',
      })
      .expect(400)
      .expect((res) => {
        // 4. res.body'yi tanımladığımız tipe cast ettik
        const body = res.body as ValidationResponse;
        const messages = body.message;

        expect(messages).toContain('age must not be less than 0');
        expect(messages).toContain('age must be an integer number');
        expect(messages).toContain('property extraField should not exist');
      });
  });

  it('/v1/cats (GET) - Check Added Cat', () => {
    return request(app.getHttpServer() as Server)
      .get('/v1/cats')
      .expect(200)
      .expect([
        {
          name: 'Gofret',
          age: 2,
          breed: 'Tekir',
        },
      ]);
  });
});
