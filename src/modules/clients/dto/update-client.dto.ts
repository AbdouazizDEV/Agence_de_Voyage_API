import { PartialType } from '@nestjs/swagger';
import { CreateClientDto } from './create-client.dto';

/**
 * DTO pour mettre à jour un client (Admin)
 */
export class UpdateClientDto extends PartialType(CreateClientDto) {}

