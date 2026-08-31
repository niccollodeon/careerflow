import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { PrismaService } from '../prisma/prisma.service.js';
import { SkillsService } from '../common/skills.service.js';

interface ScoreJobData {
  userId: string;
  applicationId: string;
  resumeId: string;
  jobDescription: string;
}

@Processor('match-scoring')
export class MatchScoringProcessor extends WorkerHost {
  private readonly logger = new Logger(MatchScoringProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly skills: SkillsService,
  ) {
    super();
  }

  async process(job: Job<ScoreJobData>): Promise<void> {
    const { applicationId, resumeId, jobDescription } = job.data;

    this.logger.log(`Processing match score for application ${applicationId}`);

    const resume = await this.prisma.client.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume) {
      this.logger.warn(`Resume ${resumeId} not found, skipping`);
      return;
    }

    const resumeSkills = this.skills.extractSkills(resume.extractedText);
    const jobSkills = this.skills.extractSkills(jobDescription);
    const matched = jobSkills.filter((skill) => resumeSkills.includes(skill));
    const score = jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 0;

    await this.prisma.client.application.update({
      where: { id: applicationId },
      data: { matchScore: score },
    });

    this.logger.log(`Application ${applicationId} scored ${score}%`);
  }
}