import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SAMPLE_PDF = join(__dirname, 'fixtures', 'sample-resume.pdf');

describe('Matching (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let userAToken: string;
  let userBToken: string;
  let userAResumeId: string;

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
    const resA = await request(app.getHttpServer()).post('/auth/register').send({
      email: 'usera@example.com',
      password: 'password123',
    });
    userAToken = resA.body.accessToken;

    const resB = await request(app.getHttpServer()).post('/auth/register').send({
      email: 'userb@example.com',
      password: 'password123',
    });
    userBToken = resB.body.accessToken;

    const uploadRes = await request(app.getHttpServer())
      .post('/resumes/upload')
      .set('Authorization', `Bearer ${userAToken}`)
      .attach('file', SAMPLE_PDF);
    userAResumeId = uploadRes.body.id;
  });

  it('calculates an accurate match score', async () => {
    const res = await request(app.getHttpServer())
      .post('/matching/score')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        resumeId: userAResumeId,
        jobDescription:
          'We need someone skilled in React, TypeScript, Node.js, PostgreSQL, and Kubernetes.',
      })
      .expect(201);

    expect(res.body.totalRequiredSkills).toBe(5);
    expect(res.body.matchedSkills).toEqual(
      expect.arrayContaining(['React', 'TypeScript', 'Node.js', 'PostgreSQL']),
    );
    expect(res.body.missingSkills).toEqual(['Kubernetes']);
    expect(res.body.score).toBe(80);
  });

  it('returns 0 when the job description has no recognized skills', async () => {
    const res = await request(app.getHttpServer())
      .post('/matching/score')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        resumeId: userAResumeId,
        jobDescription: 'We want a great communicator who works well in teams.',
      })
      .expect(201);

    expect(res.body.score).toBe(0);
    expect(res.body.totalRequiredSkills).toBe(0);
  });

  it("prevents a user from scoring against another user's resume", async () => {
    await request(app.getHttpServer())
      .post('/matching/score')
      .set('Authorization', `Bearer ${userBToken}`)
      .send({
        resumeId: userAResumeId,
        jobDescription: 'React and TypeScript required.',
      })
      .expect(403);
  });

  it('returns 404 for a resumeId that does not exist', async () => {
    await request(app.getHttpServer())
      .post('/matching/score')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        resumeId: '00000000-0000-0000-0000-000000000000',
        jobDescription: 'React required.',
      })
      .expect(404);
  });
});