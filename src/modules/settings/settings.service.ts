import { Injectable } from '@nestjs/common';
import { SettingsRepository } from './settings.repository';
import { UpdateSettingsDto } from './dto/update-settings.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  async getSettings() {
    const settings = await this.settingsRepository.getSettings();
    return {
      success: true,
      data: settings,
    };
  }

  async updateSettings(updateDto: UpdateSettingsDto) {
    const settings = await this.settingsRepository.updateSettings(updateDto);
    return {
      success: true,
      data: settings,
      message: 'Configuration mise à jour avec succès',
    };
  }
}

