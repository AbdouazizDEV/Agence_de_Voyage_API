import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';
import { UpdateOfferDto } from './dto/update-offer.dto';
import { SearchOfferDto } from './dto/search-offer.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { Prisma } from '@prisma/client';

/**
 * Repository pour les offres
 * Principe SOLID : Single Responsibility - Gère uniquement l'accès aux données
 */
@Injectable()
export class OffersRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(
    pagination: PaginationDto,
    filters?: any,
  ): Promise<{ data: Offer[]; total: number }> {
    const { page = 1, limit = 12 } = pagination;
    const skip = (page - 1) * limit;

    const where: Prisma.OfferWhereInput = {
      ...(filters?.isActive !== undefined ? { is_active: filters.isActive } : { is_active: true }),
      ...(filters?.category && { category: filters.category }),
      ...(filters?.minPrice && { price: { gte: filters.minPrice } }),
      ...(filters?.maxPrice && { price: { lte: filters.maxPrice } }),
      ...(filters?.isPromotion && { is_promotion: true }),
      ...(filters?.search && {
        OR: [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          { destination: { contains: filters.search, mode: 'insensitive' } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      this.prisma.offer.findMany({
        where,
        orderBy: { created_at: 'desc' },
        skip,
        take: limit,
      }),
      this.prisma.offer.count({ where }),
    ]);

    return {
      data: data.map(this.mapPrismaToOffer) as Offer[],
      total,
    };
  }

  async findById(id: string): Promise<Offer | null> {
    const offer = await this.prisma.offer.findUnique({
      where: { id },
    });

    return offer ? this.mapPrismaToOffer(offer) as Offer : null;
  }

  async create(createDto: CreateOfferDto): Promise<Offer> {
    const offer = await this.prisma.offer.create({
      data: createDto as any,
    });

    return this.mapPrismaToOffer(offer) as Offer;
  }

  async update(id: string, updateDto: UpdateOfferDto): Promise<Offer> {
    const offer = await this.prisma.offer.update({
      where: { id },
      data: updateDto as any,
    });

    return this.mapPrismaToOffer(offer) as Offer;
  }

  async delete(id: string): Promise<boolean> {
    try {
      await this.prisma.offer.delete({
        where: { id },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async search(searchDto: SearchOfferDto): Promise<Offer[]> {
    const where: Prisma.OfferWhereInput = {
      is_active: true,
      ...(searchDto.destination && {
        destination: { contains: searchDto.destination, mode: 'insensitive' },
      }),
      ...(searchDto.category && { category: searchDto.category }),
      ...(searchDto.minPrice && { price: { gte: searchDto.minPrice } }),
      ...(searchDto.maxPrice && { price: { lte: searchDto.maxPrice } }),
      ...(searchDto.isPromotion && { is_promotion: true }),
    };

    const offers = await this.prisma.offer.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    return offers.map(this.mapPrismaToOffer) as Offer[];
  }

  async findPromotions(): Promise<Offer[]> {
    const offers = await this.prisma.offer.findMany({
      where: {
        is_active: true,
        is_promotion: true,
        promotion_ends_at: { gt: new Date() },
      },
      orderBy: { promotion_discount: 'desc' },
      take: 10,
    });

    return offers.map(this.mapPrismaToOffer) as Offer[];
  }

  async findPopular(): Promise<Offer[]> {
    const offers = await this.prisma.offer.findMany({
      where: {
        is_active: true,
      },
      orderBy: { bookings_count: 'desc' },
      take: 10,
    });

    return offers.map(this.mapPrismaToOffer) as Offer[];
  }

  private mapPrismaToOffer(offer: any): any {
    return {
      ...offer,
      price: typeof offer.price === 'object' && offer.price !== null 
        ? parseFloat(offer.price.toString()) 
        : offer.price,
      rating: typeof offer.rating === 'object' && offer.rating !== null 
        ? parseFloat(offer.rating.toString()) 
        : offer.rating,
    };
  }
}
