import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { NotificationsService } from './notifications.service';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { CancelReservationDto } from './dto/cancel-reservation.dto';
import { JwtClientGuard } from '../../common/guards/jwt-client.guard';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { ApiStandardResponse } from '../../common/decorators/api-response.decorator';
import { ReservationResponseDto } from './dto/reservation-response.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';

/**
 * Contrôleur Réservations - Routes client
 */
@ApiTags('Reservations Client')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtClientGuard)
@Controller({ path: 'reservations', version: '1' })
export class ReservationsController {
  constructor(
    private readonly reservationsService: ReservationsService,
    private readonly notificationsService: NotificationsService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Créer une réservation',
    description: 'Créer une nouvelle réservation pour une offre',
  })
  @ApiStandardResponse(ReservationResponseDto)
  async create(@Request() req: any, @Body() createDto: CreateReservationDto) {
    return this.reservationsService.create(req.user.id, createDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Liste des réservations',
    description: 'Récupère toutes les réservations du client avec pagination',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 12 })
  @ApiQuery({
    name: 'status',
    required: false,
    enum: ['pending', 'confirmed', 'cancelled', 'completed'],
  })
  @ApiStandardResponse(ReservationResponseDto, true)
  async findAll(
    @Request() req: any,
    @Query() pagination: PaginationDto,
    @Query('status') status?: string,
  ) {
    return this.reservationsService.findAll(req.user.id, pagination, {
      status,
    });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Détails d'une réservation",
    description: "Récupère les détails d'une réservation spécifique",
  })
  @ApiStandardResponse(ReservationResponseDto)
  async findOne(@Request() req: any, @Param('id') id: string) {
    return this.reservationsService.findOne(req.user.id, id);
  }

  @Post(':id/cancel')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Annuler une réservation',
    description: 'Annule une réservation et rembourse le paiement',
  })
  @ApiStandardResponse(ReservationResponseDto)
  async cancel(
    @Request() req: any,
    @Param('id') id: string,
    @Body() cancelDto: CancelReservationDto,
  ) {
    return this.reservationsService.cancel(req.user.id, id, cancelDto);
  }

  @Post('payments')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Effectuer un paiement',
    description: 'Simule un paiement pour une réservation',
  })
  @ApiStandardResponse(PaymentResponseDto)
  async createPayment(
    @Request() req: any,
    @Body() createDto: CreatePaymentDto,
  ) {
    return this.reservationsService.createPayment(req.user.id, createDto);
  }

  @Get(':id/payments')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Historique des paiements',
    description: "Récupère l'historique des paiements d'une réservation",
  })
  @ApiStandardResponse(PaymentResponseDto, true)
  async getPayments(@Request() req: any, @Param('id') id: string) {
    return this.reservationsService.getPayments(req.user.id, id);
  }

  @Get('notifications/list')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Liste des notifications',
    description: 'Récupère toutes les notifications du client',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 20 })
  @ApiQuery({ name: 'isRead', required: false, type: Boolean })
  @ApiQuery({ name: 'type', required: false, type: String })
  async getNotifications(
    @Request() req: any,
    @Query() pagination: PaginationDto,
    @Query('isRead') isRead?: boolean,
    @Query('type') type?: string,
  ) {
    return this.notificationsService.findAll(req.user.id, pagination, {
      isRead,
      type,
    });
  }

  @Get('notifications/unread-count')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Nombre de notifications non lues',
    description: 'Récupère le nombre de notifications non lues',
  })
  async getUnreadCount(@Request() req: any) {
    return this.notificationsService.getUnreadCount(req.user.id);
  }

  @Post('notifications/:id/read')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Marquer une notification comme lue',
    description: 'Marque une notification spécifique comme lue',
  })
  async markAsRead(@Request() req: any, @Param('id') id: string) {
    return this.notificationsService.markAsRead(req.user.id, id);
  }

  @Post('notifications/read-all')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Marquer toutes les notifications comme lues',
    description: 'Marque toutes les notifications du client comme lues',
  })
  async markAllAsRead(@Request() req: any) {
    return this.notificationsService.markAllAsRead(req.user.id);
  }
}
