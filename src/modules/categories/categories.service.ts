import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CategoriesRepository } from './categories.repository';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { ERROR_CODES } from '../../common/constants/error-codes.constants';
import { SlugUtil } from '../../common/utils/slug.util';

@Injectable()
export class CategoriesService {
  constructor(private readonly categoriesRepository: CategoriesRepository) {}

  async findAll(includeInactive = false) {
    const categories = await this.categoriesRepository.findAll(includeInactive);
    return {
      success: true,
      data: categories,
    };
  }

  async findOne(id: string) {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: 'Catégorie non trouvée',
      });
    }

    return {
      success: true,
      data: category,
    };
  }

  async create(createDto: CreateCategoryDto) {
    // Vérifier si le nom existe déjà
    const existing = await this.categoriesRepository.findBySlug(
      SlugUtil.generate(createDto.name),
    );
    if (existing) {
      throw new ConflictException({
        code: ERROR_CODES.RESOURCE_ALREADY_EXISTS,
        message: 'Une catégorie avec ce nom existe déjà',
      });
    }

    const category = await this.categoriesRepository.create(createDto);

    return {
      success: true,
      data: category,
      message: 'Catégorie créée avec succès',
    };
  }

  async update(id: string, updateDto: UpdateCategoryDto) {
    const existing = await this.categoriesRepository.findById(id);
    if (!existing) {
      throw new NotFoundException({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: 'Catégorie non trouvée',
      });
    }

    const category = await this.categoriesRepository.update(id, updateDto);

    return {
      success: true,
      data: category,
      message: 'Catégorie mise à jour avec succès',
    };
  }

  async delete(id: string) {
    const category = await this.categoriesRepository.findById(id);
    if (!category) {
      throw new NotFoundException({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: 'Catégorie non trouvée',
      });
    }

    await this.categoriesRepository.delete(id);

    return {
      success: true,
      message: 'Catégorie supprimée avec succès',
    };
  }

  async toggleStatus(id: string) {
    const category = await this.categoriesRepository.toggleStatus(id);

    return {
      success: true,
      data: {
        id: category.id,
        isActive: category.is_active,
      },
      message: 'Statut de la catégorie modifié',
    };
  }
}
