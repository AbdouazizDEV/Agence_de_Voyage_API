import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { SupabaseStorageService } from '../../database/supabase-storage.service';

@Module({
  controllers: [UploadController],
  providers: [UploadService, SupabaseStorageService],
  exports: [UploadService],
})
export class UploadModule {}
