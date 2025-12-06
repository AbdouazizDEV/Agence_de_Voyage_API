import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { OffersRepository } from './offers.repository';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { SearchOfferDto } from './dto/search-offer.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { SlugUtil } from '../../common/utils/slug.util';
import { ERROR_CODES } from '../../common/constants/error-codes.constants';
import { SupabaseStorageService } from '../../database/supabase-storage.service';
import { PrismaService } from '../../database/prisma.service';

/**
 * Service pour la gestion des offres
 * Principe SOLID : Single Responsibility - Gère uniquement la logique métier des offres
 */
@Injectable()
export class OffersService {
  constructor(
    private readonly offersRepository: OffersRepository,
    private readonly supabaseStorage: SupabaseStorageService,
    private readonly prisma: PrismaService,
  ) {}

  async findAll(pagination: PaginationDto, filters?: any) {
    const result = await this.offersRepository.findAll(pagination, filters);
    const totalPages = Math.ceil(result.total / (pagination.limit || 12));

    return {
      success: true,
      data: result.data,
      pagination: {
        page: pagination.page || 1,
        limit: pagination.limit || 12,
        total: result.total,
        totalPages,
      },
    };
  }

  async findOne(id: string) {
    const offer = await this.offersRepository.findById(id);

    if (!offer) {
      throw new NotFoundException({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: 'Offre non trouvée',
      });
    }

    // Incrémenter le compteur de vues
    await this.offersRepository.update(id, {
      views_count: offer.views_count + 1,
    } as any);

    return {
      success: true,
      data: { ...offer, views_count: offer.views_count + 1 },
    };
  }

  async create(createDto: CreateOfferDto, images?: Express.Multer.File[]) {
    // Vérifier que la catégorie existe et est active
    const category = await this.prisma.category.findFirst({
      where: {
        name: createDto.category,
        is_active: true,
      },
    });

    if (!category) {
      throw new BadRequestException({
        code: ERROR_CODES.VALIDATION_ERROR,
        message: `La catégorie "${createDto.category}" n'existe pas ou n'est pas active`,
      });
    }

    // Générer le slug
    const slug = SlugUtil.generate(createDto.title);

    // Upload des images si fournies
    let imageUrls: string[] = [];
    if (images && images.length > 0) {
      try {
        const uploaded = await this.supabaseStorage.uploadMultipleFiles(images, 'offers');
        imageUrls = uploaded.map(img => img.url);
      } catch (error) {
        console.error('Erreur upload images:', error);
        // Continuer sans images si l'upload échoue
      }
    }

    // Utiliser les images uploadées ou celles fournies dans le DTO
    const finalImages = imageUrls.length > 0 ? imageUrls : (createDto.images || []);

    const offer = await this.offersRepository.create({
      ...createDto,
      slug,
      images: finalImages,
    } as any);

    return {
      success: true,
      data: offer,
      message: 'Offre créée avec succès',
    };
  }

  async update(
    id: string,
    updateDto: UpdateOfferDto,
    images?: Express.Multer.File[],
    imagesAction: 'add' | 'replace' = 'add',
  ) {
    const existingOffer = await this.offersRepository.findById(id);

    if (!existingOffer) {
      throw new NotFoundException({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: 'Offre non trouvée',
      });
    }

    // Vérifier que la catégorie existe si elle est modifiée
    if (updateDto.category && updateDto.category !== existingOffer.category) {
      const category = await this.prisma.category.findFirst({
        where: {
          name: updateDto.category,
          is_active: true,
        },
      });

      if (!category) {
        throw new BadRequestException({
          code: ERROR_CODES.VALIDATION_ERROR,
          message: `La catégorie "${updateDto.category}" n'existe pas ou n'est pas active`,
        });
      }
    }

    // Si le titre change, régénérer le slug
    const updateData: any = { ...updateDto };
    if (updateDto.title && updateDto.title !== existingOffer.title) {
      updateData.slug = SlugUtil.generate(updateDto.title);
    }

    // Upload des nouvelles images si fournies
    if (images && images.length > 0) {
      try {
        const uploaded = await this.supabaseStorage.uploadMultipleFiles(images, 'offers');
        const newImageUrls = uploaded.map(img => img.url);
        
        // Gérer l'action sur les images : ajouter ou remplacer
        if (imagesAction === 'replace') {
          // Remplacer toutes les images existantes par les nouvelles
          updateData.images = newImageUrls;
        } else {
          // Ajouter les nouvelles images aux existantes (par défaut)
          updateData.images = [...(existingOffer.images || []), ...newImageUrls];
        }
      } catch (error) {
        console.error('Erreur upload images:', error);
        // Ne pas bloquer la mise à jour si l'upload échoue
        // Mais on peut optionnellement lancer une erreur
        throw new BadRequestException({
          code: ERROR_CODES.VALIDATION_ERROR,
          message: 'Erreur lors de l\'upload des images',
        });
      }
    } else if (updateDto.images !== undefined) {
      // Si images est explicitement défini dans le DTO (même si vide), l'utiliser
      updateData.images = updateDto.images;
    }

    const offer = await this.offersRepository.update(id, updateData);

    return {
      success: true,
      data: offer,
      message: 'Offre mise à jour avec succès',
    };
  }

  async delete(id: string) {
    const offer = await this.offersRepository.findById(id);

    if (!offer) {
      throw new NotFoundException({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: 'Offre non trouvée',
      });
    }

    await this.offersRepository.delete(id);

    return {
      success: true,
      message: 'Offre supprimée avec succès',
    };
  }

  async search(searchDto: SearchOfferDto) {
    const offers = await this.offersRepository.search(searchDto);

    return {
      success: true,
      data: offers,
    };
  }

  async findPromotions() {
    const offers = await this.offersRepository.findPromotions();

    return {
      success: true,
      data: offers,
    };
  }

  async findPopular() {
    const offers = await this.offersRepository.findPopular();

    return {
      success: true,
      data: offers,
    };
  }

  async toggleStatus(id: string) {
    const offer = await this.offersRepository.findById(id);

    if (!offer) {
      throw new NotFoundException({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: 'Offre non trouvée',
      });
    }

    const updated = await this.offersRepository.update(id, {
      is_active: !offer.is_active,
    } as any);

    return {
      success: true,
      data: {
        id: updated.id,
        isActive: updated.is_active,
      },
      message: 'Statut de l\'offre modifié',
    };
  }

  async duplicate(id: string) {
    const originalOffer = await this.offersRepository.findById(id);

    if (!originalOffer) {
      throw new NotFoundException({
        code: ERROR_CODES.RESOURCE_NOT_FOUND,
        message: 'Offre non trouvée',
      });
    }

    // Créer une copie avec un nouveau slug
    const duplicatedData: any = {
      ...originalOffer,
      title: `${originalOffer.title} (Copie)`,
      slug: SlugUtil.generate(`${originalOffer.title} (Copie)`),
      is_active: false, // Désactiver par défaut
      bookings_count: 0,
      views_count: 0,
    };

    // Supprimer l'id pour créer un nouveau
    delete duplicatedData.id;
    delete duplicatedData.created_at;
    delete duplicatedData.updated_at;

    const duplicated = await this.offersRepository.create(duplicatedData);

    return {
      success: true,
      data: duplicated,
      message: 'Offre dupliquée avec succès',
    };
  }
}

