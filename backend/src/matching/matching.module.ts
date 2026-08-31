import { Module } from '@nestjs/common';
import { MatchingController } from './matching.controller.js';
import { MatchingService } from './matching.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [MatchingController],
  providers: [MatchingService],
})
export class MatchingModule {}