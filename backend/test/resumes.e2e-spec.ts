import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SAMPLE_PDF = join(__dirname, 'fixtures', 'sample-resume.pdf');

describe('Resumes (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();

    prisma = moduleFixture.get(PrismaService);
  });

  afterEach(async () => {
    await prisma.client.resume.deleteMany();
    await prisma.client.application.deleteMany();
    await prisma.client.job.deleteMany();
    await prisma.client.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    const res = await request(app.getHttpServer()).post('/auth/register').send({
      email: 'resumeuser@example.com',
      password: 'password123',
    });
    token = res.body.accessToken;
  });

  it('rejects unauthenticated upload requests with 401', () => {
    return request(app.getHttpServer())
        .post('/resumes/upload')
        .expect(401);
    });

  it('uploads a PDF and extracts its text', async () => {
    const res = await request(app.getHttpServer())
      .post('/resumes/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', SAMPLE_PDF)
      .expect(201);

    expect(res.body.id).toBeDefined();
    expect(res.body.fileName).toBe('sample-resume.pdf');
    expect(res.body.textPreview).toContain('Test Candidate');
  });

  it('rejects a non-PDF file with 400', async () => {
    const textFilePath = join(__dirname, 'fixtures', 'not-a-pdf.txt');
    const { writeFileSync } = await import('fs');
    writeFileSync(textFilePath, 'this is not a pdf');

    await request(app.getHttpServer())
      .post('/resumes/upload')
      .set('Authorization', `Bearer ${token}`)
      .attach('file', textFilePath)
      .expect(400);
  });
});