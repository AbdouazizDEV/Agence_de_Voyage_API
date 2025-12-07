import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SupabaseStorageService } from '../../database/supabase-storage.service';
import { ERROR_CODES } from '../../common/constants/error-codes.constants';

@Injectable()
export class UploadService {
  private readonly maxFileSize: number;
  private readonly allowedMimeTypes: string[];

  constructor(
    private readonly supabaseStorage: SupabaseStorageService,
    private readonly configService: ConfigService,
  ) {
    this.maxFileSize = parseInt(
      this.configService.get<string>('MAX_FILE_SIZE', '5242880'),
      10,
    );
    this.allowedMimeTypes = this.configService
      .get<string>(
        'ALLOWED_FILE_TYPES',
        'image/jpeg,image/png,image/webp,image/jpg',
      )
      .split(',');
  }

  async uploadFile(
    file: Express.Multer.File,
    folder = 'offers',
  ): Promise<{
    url: string;
    filename: string;
    size: number;
    mimeType: string;
  }> {
    // Validation
    this.validateFile(file);

    const url = await this.supabaseStorage.uploadFile(file, folder);
    const fileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;

    return {
      url,
      filename: fileName,
      size: file.size,
      mimeType: file.mimetype,
    };
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder = 'offers',
  ): Promise<{
    uploaded: Array<{ url: string; filename: string }>;
    count: number;
  }> {
    // Validation de tous les fichiers
    files.forEach((file) => this.validateFile(file));

    const uploaded = await this.supabaseStorage.uploadMultipleFiles(
      files,
      folder,
    );

    return {
      uploaded,
      count: uploaded.length,
    };
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    return this.supabaseStorage.deleteFile(fileUrl);
  }

  private validateFile(file: Express.Multer.File): void {
    if (!file) {
      throw new BadRequestException({
        code: ERROR_CODES.VALIDATION_ERROR,
        message: 'Aucun fichier fourni',
      });
    }

    if (file.size > this.maxFileSize) {
      throw new BadRequestException({
        code: ERROR_CODES.FILE_TOO_LARGE,
        message: `L'image ne doit pas dépasser ${this.maxFileSize / 1024 / 1024}MB`,
      });
    }

    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException({
        code: ERROR_CODES.INVALID_FILE_TYPE,
        message: `Type de fichier non autorisé. Types acceptés: ${this.allowedMimeTypes.join(', ')}`,
      });
    }
  }
}
