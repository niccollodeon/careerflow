import { IsString, IsUUID } from 'class-validator';

export class MatchScoreDto {
  @IsUUID()
  resumeId: string;

  @IsString()
  jobDescription: string;
}