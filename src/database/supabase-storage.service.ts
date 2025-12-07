import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Service Supabase Storage - Gestion upload fichiers
 * Principe SOLID : Single Responsibility - Gère uniquement le stockage
 */
@Injectable()
export class SupabaseStorageService implements OnModuleInit {
  private supabase: SupabaseClient;
  private bucketName: string = 'imagesVoyages';

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const supabaseUrl = this.configService.get<string>('SUPABASE_URL');
    const supabaseKey =
      this.configService.get<string>('SUPABASE_SERVICE_KEY') ||
      this.configService.get<string>('SUPABASE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      console.warn(
        '⚠️  Configuration Supabase Storage manquante - Upload désactivé',
      );
      return;
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async uploadFile(
    file: Express.Multer.File,
    folder: string = 'offers',
  ): Promise<string> {
    if (!this.supabase) {
      throw new Error(
        "Supabase Storage n'est pas configuré. Vérifiez vos variables d'environnement.",
      );
    }

    const fileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      throw new Error(`Erreur upload: ${error.message}`);
    }

    // Récupérer l'URL publique
    const {
      data: { publicUrl },
    } = this.supabase.storage.from(this.bucketName).getPublicUrl(filePath);

    return publicUrl;
  }

  async uploadMultipleFiles(
    files: Express.Multer.File[],
    folder: string = 'offers',
  ): Promise<Array<{ url: string; filename: string }>> {
    if (!this.supabase) {
      throw new Error(
        "Supabase Storage n'est pas configuré. Vérifiez vos variables d'environnement.",
      );
    }

    const uploadPromises = files.map(async (file) => {
      const url = await this.uploadFile(file, folder);
      const fileName = `${Date.now()}-${file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      return {
        url,
        filename: fileName,
      };
    });

    return Promise.all(uploadPromises);
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    if (!this.supabase) {
      throw new Error(
        "Supabase Storage n'est pas configuré. Vérifiez vos variables d'environnement.",
      );
    }

    try {
      // Extraire le chemin du fichier depuis l'URL
      const urlParts = fileUrl.split('/');
      const filePath = urlParts
        .slice(urlParts.indexOf(this.bucketName) + 1)
        .join('/');

      const { error } = await this.supabase.storage
        .from(this.bucketName)
        .remove([filePath]);

      if (error) {
        throw new Error(error.message);
      }

      return true;
    } catch (error) {
      return false;
    }
  }
}
