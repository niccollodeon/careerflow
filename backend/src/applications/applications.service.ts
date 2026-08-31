import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateApplicationDto } from './dto/create-application.dto.js';
import { UpdateApplicationDto } from './dto/update-application.dto.js';
import { QuickAddDto } from './dto/quick-add.dto.js';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly prisma: PrismaService,
    @InjectQueue('match-scoring') private readonly matchScoringQueue: Queue,
  ) {}

  create(userId: string, dto: CreateApplicationDto) {
    return this.prisma.client.application.create({
      data: {
        ...dto,
        userId,
      },
    });
  }

  findAll(userId: string) {
    return this.prisma.client.application.findMany({
      where: { userId },
      include: { job: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(userId: string, id: string) {
    const application = await this.prisma.client.application.findUnique({
      where: { id },
      include: { job: true },
    });

    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }

    if (application.userId !== userId) {
      throw new ForbiddenException('You do not have access to this application');
    }

    return application;
  }

  async update(userId: string, id: string, dto: UpdateApplicationDto) {
    await this.findOne(userId, id);

    return this.prisma.client.application.update({
      where: { id },
      data: dto,
    });
  }

  async remove(userId: string, id: string) {
    await this.findOne(userId, id);

    return this.prisma.client.application.delete({ where: { id } });
  }

  async quickAdd(userId: string, dto: QuickAddDto) {
    const application = await this.prisma.client.$transaction(async (tx) => {
      const job = await tx.job.create({
        data: {
          title: dto.title,
          company: dto.company,
          description: dto.description,
          location: dto.location,
          sourceUrl: dto.sourceUrl,
        },
      });

      return tx.application.create({
        data: {
          userId,
          jobId: job.id,
          status: 'SAVED',
        },
        include: { job: true },
      });
    });

    const latestResume = await this.prisma.client.resume.findFirst({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });

    if (latestResume) {
      await this.matchScoringQueue.add('score-application', {
        userId,
        applicationId: application.id,
        resumeId: latestResume.id,
        jobDescription: application.job.description,
      });
    }

    return application;
  }
}