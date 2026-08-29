import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateJobDto } from './dto/create-job.dto.js';
import { UpdateJobDto } from './dto/update-job.dto.js';

@Injectable()
export class JobsService {
  constructor(private readonly prisma: PrismaService) {}

  create(createJobDto: CreateJobDto) {
    return this.prisma.client.job.create({
      data: createJobDto,
    });
  }

  findAll() {
    return this.prisma.client.job.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const job = await this.prisma.client.job.findUnique({ where: { id } });

    if (!job) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }

    return job;
  }

  async update(id: string, updateJobDto: UpdateJobDto) {
    await this.findOne(id);

    return this.prisma.client.job.update({
      where: { id },
      data: updateJobDto,
    });
  }

  async remove(id: string) {
    await this.findOne(id);

    return this.prisma.client.job.delete({ where: { id } });
  }
}