import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { MatchingController } from './matching.controller.js';
import { MatchingService } from './matching.service.js';
import { MatchScoringProcessor } from './match-scoring.processor.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [
    AuthModule,
    BullModule.registerQueue({
      name: 'match-scoring',
    }),
  ],
  controllers: [MatchingController],
  providers: [MatchingService, MatchScoringProcessor],
})
export class MatchingModule {}