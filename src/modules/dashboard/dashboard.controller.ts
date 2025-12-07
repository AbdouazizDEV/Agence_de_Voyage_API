import {
  Controller,
  Get,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiResponse,
} from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { DashboardStatsResponseDto } from './dto/dashboard-stats-response.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { ApiStandardResponse } from '../../common/decorators/api-response.decorator';

@ApiTags('Dashboard')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin', 'super_admin')
@Controller({ path: 'dashboard', version: '1' })
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('stats')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Statistiques complètes du dashboard',
    description: `
      Récupère toutes les statistiques du tableau de bord de l'agence de voyage.
      
      **Statistiques incluses:**
      - **Offres**: Total, actives, inactives, promotions, note moyenne
      - **Clients**: Total, actifs, nouveaux ce mois
      - **Réservations**: Total, par statut (pending, confirmed, cancelled, completed), créées ce mois
      - **Revenus**: Total, du mois, montant moyen par réservation
      - **Paiements**: En attente, complétés, montant remboursé
      - **Notifications**: Non lues, total
      - **Métriques**: Catégorie la plus populaire, taux de conversion
    `,
  })
  @ApiStandardResponse(DashboardStatsResponseDto)
  async getStats() {
    return this.dashboardService.getStats();
  }
}
