import { IsString, IsOptional, IsUrl } from 'class-validator';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  company: string;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  source?: string;

  @IsOptional()
  @IsUrl()
  sourceUrl?: string;
}