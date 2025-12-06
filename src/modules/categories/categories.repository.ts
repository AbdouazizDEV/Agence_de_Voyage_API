import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SlugUtil } from '../../common/utils/slug.util';

/**
 * Repository pour les catégories
 */
@Injectable()
export class CategoriesRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(includeInactive = false): Promise<Category[]> {
    const categories = await this.prisma.category.findMany({
      where: includeInactive ? {} : { is_active: true },
      orderBy: { display_order: 'asc' },
    });

    return categories as Category[];
  }

  async findById(id: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    return category as Category | null;
  }

  async findBySlug(slug: string): Promise<Category | null> {
    const category = await this.prisma.category.findUnique({
      where: { slug },
    });

    return category as Category | null;
  }

  async create(createDto: CreateCategoryDto): Promise<Category> {
    const slug = SlugUtil.generate(createDto.name);

    const category = await this.prisma.category.create({
      data: {
        name: createDto.name,
        slug,
        description: createDto.description,
        icon: createDto.icon,
        display_order: createDto.displayOrder || 0,
      },
    });

    return category as Category;
  }

  async update(id: string, updateDto: UpdateCategoryDto): Promise<Category> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error('Catégorie non trouvée');
    }

    const updateData: any = { ...updateDto };
    if (updateDto.name && updateDto.name !== existing.name) {
      updateData.slug = SlugUtil.generate(updateDto.name);
    }

    const category = await this.prisma.category.update({
      where: { id },
      data: {
        ...(updateData.name && { name: updateData.name }),
        ...(updateData.slug && { slug: updateData.slug }),
        ...(updateData.description !== undefined && { description: updateData.description }),
        ...(updateData.icon !== undefined && { icon: updateData.icon }),
        ...(updateData.displayOrder !== undefined && { display_order: updateData.displayOrder }),
      },
    });

    return category as Category;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.category.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async toggleStatus(id: string): Promise<Category> {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category) {
      throw new Error('Catégorie non trouvée');
    }

    const updated = await this.prisma.category.update({
      where: { id },
      data: { is_active: !category.is_active },
    });

    return updated as Category;
  }
}

