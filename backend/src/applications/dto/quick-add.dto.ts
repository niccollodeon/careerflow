import { IsString, IsOptional, IsUrl } from 'class-validator';

export class QuickAddDto {
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
  @IsUrl()
  sourceUrl?: string;
}