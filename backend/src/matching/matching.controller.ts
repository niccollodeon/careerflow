import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { CurrentUser } from '../auth/current-user.decorator.js';
import { MatchingService } from './matching.service.js';
import { MatchScoreDto } from './dto/match-score.dto.js';

@UseGuards(JwtAuthGuard)
@Controller('matching')
export class MatchingController {
  constructor(private readonly matchingService: MatchingService) {}

  @Post('score')
  score(@CurrentUser() user: any, @Body() dto: MatchScoreDto) {
    return this.matchingService.scoreMatch(user.userId, dto.resumeId, dto.jobDescription);
  }
}