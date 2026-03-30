import { IsEnum } from 'class-validator';
import { LeadStatus } from '../enums/lead-status.enum';

export class ChangeLeadStatusDto {
  @IsEnum(LeadStatus)
  status: LeadStatus;
}
