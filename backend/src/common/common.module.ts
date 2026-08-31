import { Global, Module } from '@nestjs/common';
import { SkillsService } from './skills.service.js';

@Global()
@Module({
  providers: [SkillsService],
  exports: [SkillsService],
})
export class CommonModule {}