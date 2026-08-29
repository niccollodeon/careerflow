import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module.js';
import { PrismaService } from '../src/prisma/prisma.service.js';

describe('Applications (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  let userAToken: string;
  let userBToken: string;

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
    await prisma.client.application.deleteMany();
    await prisma.client.job.deleteMany();
    await prisma.client.user.deleteMany();
  });

  afterAll(async () => {
    await app.close();
  });

  async function registerAndLogin(email: string) {
    const res = await request(app.getHttpServer()).post('/auth/register').send({
      email,
      password: 'password123',
    });
    return res.body.accessToken as string;
  }

  beforeEach(async () => {
    userAToken = await registerAndLogin('usera@example.com');
    userBToken = await registerAndLogin('userb@example.com');
  });

  it('rejects unauthenticated requests with 401', () => {
    return request(app.getHttpServer()).get('/applications').expect(401);
  });

  it('allows a user to create an application via quick-add', async () => {
    const res = await request(app.getHttpServer())
      .post('/applications/quick-add')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({
        title: 'Backend Engineer',
        company: 'TestCo',
        description: 'A job',
      })
      .expect(201);

    expect(res.body.status).toBe('SAVED');
    expect(res.body.job.title).toBe('Backend Engineer');
  });

  it('only returns the logged-in user\'s applications', async () => {
    await request(app.getHttpServer())
      .post('/applications/quick-add')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({ title: 'Job A', company: 'Co A', description: 'desc' });

    await request(app.getHttpServer())
      .post('/applications/quick-add')
      .set('Authorization', `Bearer ${userBToken}`)
      .send({ title: 'Job B', company: 'Co B', description: 'desc' });

    const resA = await request(app.getHttpServer())
      .get('/applications')
      .set('Authorization', `Bearer ${userAToken}`)
      .expect(200);

    expect(resA.body).toHaveLength(1);
    expect(resA.body[0].job.title).toBe('Job A');
  });

  it('prevents a user from accessing another user\'s application by id', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/applications/quick-add')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({ title: 'Private Job', company: 'Co A', description: 'desc' });

    const applicationId = createRes.body.id;

    await request(app.getHttpServer())
      .get(`/applications/${applicationId}`)
      .set('Authorization', `Bearer ${userBToken}`)
      .expect(403);
  });

  it('prevents a user from updating another user\'s application', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/applications/quick-add')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({ title: 'Private Job', company: 'Co A', description: 'desc' });

    const applicationId = createRes.body.id;

    await request(app.getHttpServer())
      .patch(`/applications/${applicationId}`)
      .set('Authorization', `Bearer ${userBToken}`)
      .send({ status: 'REJECTED' })
      .expect(403);
  });

  it('prevents a user from deleting another user\'s application', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/applications/quick-add')
      .set('Authorization', `Bearer ${userAToken}`)
      .send({ title: 'Private Job', company: 'Co A', description: 'desc' });

    const applicationId = createRes.body.id;

    await request(app.getHttpServer())
      .delete(`/applications/${applicationId}`)
      .set('Authorization', `Bearer ${userBToken}`)
      .expect(403);
  });
});