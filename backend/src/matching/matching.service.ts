import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { SkillsService } from '../common/skills.service.js';

@Injectable()
export class MatchingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly skills: SkillsService,
  ) {}

  async scoreMatch(userId: string, resumeId: string, jobDescription: string) {
    const resume = await this.prisma.client.resume.findUnique({
      where: { id: resumeId },
    });

    if (!resume) {
      throw new NotFoundException('Resume not found');
    }

    if (resume.userId !== userId) {
      throw new ForbiddenException('You do not have access to this resume');
    }

    const resumeSkills = this.skills.extractSkills(resume.extractedText);
    const jobSkills = this.skills.extractSkills(jobDescription);

    const matched = jobSkills.filter((skill) => resumeSkills.includes(skill));
    const missing = jobSkills.filter((skill) => !resumeSkills.includes(skill));

    const score =
      jobSkills.length > 0 ? Math.round((matched.length / jobSkills.length) * 100) : 0;

    return {
      score,
      matchedSkills: matched,
      missingSkills: missing,
      totalRequiredSkills: jobSkills.length,
    };
  }
}