import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApplicationStatus } from '../../generated/prisma/enums.js';

export class CreateApplicationDto {
  @IsString()
  jobId: string;

  @IsOptional()
  @IsEnum(ApplicationStatus)
  status?: ApplicationStatus;

  @IsOptional()
  @IsDateString()
  appliedAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}