import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import request from 'supertest';
import { Server } from 'http';
import { AppModule } from 'src/app.module';

// Define strict interfaces for response bodies to avoid 'unsafe member access' on 'any'
interface ValidationResponse {
  message: string[];
  error: string;
  statusCode: number;
}

interface CatResponse {
  name: string;
  age: number;
  breed: string;
  gender: string;
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
    return (
      request(app.getHttpServer() as Server)
        .get('/v1/cats')
        .expect(200)
        // FIX: Expect initial data from CatsService instead of empty array
        .expect([
          {
            name: 'Garfield',
            age: 5,
            breed: 'Tabby',
            gender: 'Female',
          },
          {
            name: 'Mittens',
            age: 3,
            breed: 'Siamese',
            gender: 'Male',
          },
        ])
    );
  });

  it('/v1/cats (POST)', () => {
    return request(app.getHttpServer() as Server)
      .post('/v1/cats')
      .send({
        name: 'Gofret',
        age: 2,
        breed: 'Tekir',
        gender: 'Male',
      })
      .expect(201)
      .expect('This action adds a new cat');
  });

  it('/v1/cats (POST) - Validation Error', () => {
    return request(app.getHttpServer() as Server)
      .post('/v1/cats')
      .send({
        name: 'Gofret',
        breed: 'Tekir',
        extraField: 'Bunu kabul etmemeli',
      })
      .expect(400)
      .expect((res) => {
        // Cast res.body explicitly to handle 'any' type safely
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
      .expect((res) => {
        // Safe cast for array response
        const body = res.body as CatResponse[];

        // FIX: Find the added cat in the array instead of checking index 0
        const gofret = body.find((cat) => cat.name === 'Gofret');

        expect(gofret).toBeDefined();
        expect(gofret?.age).toBe(2);
        expect(gofret?.breed).toBe('Tekir');

        // Optional: Verify total count (2 initial + 1 new = 3)
        expect(body.length).toBe(3);
      });
  });
});
