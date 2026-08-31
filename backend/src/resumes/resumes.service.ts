import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { PDFParse } from 'pdf-parse';
import { readFile } from 'fs/promises';

@Injectable()
export class ResumesService {
  constructor(private readonly prisma: PrismaService) {}

  async processUpload(userId: string, file: Express.Multer.File) {
    const fileBuffer = await readFile(file.path);

    const parser = new PDFParse({ data: fileBuffer });
    const result = await parser.getText();
    await parser.destroy();

    const resume = await this.prisma.client.resume.create({
      data: {
        userId,
        fileName: file.originalname,
        filePath: file.path,
        extractedText: result.text,
      },
    });

    return {
      id: resume.id,
      fileName: resume.fileName,
      textPreview: result.text.slice(0, 200),
      createdAt: resume.createdAt,
    };
  }
}