import { Module } from '@nestjs/common';
import { ResumesController } from './resumes.controller.js';
import { ResumesService } from './resumes.service.js';
import { AuthModule } from '../auth/auth.module.js';

@Module({
  imports: [AuthModule],
  controllers: [ResumesController],
  providers: [ResumesService],
})
export class ResumesModule {}