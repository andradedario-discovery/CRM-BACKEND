import { IsNotEmpty, IsString } from 'class-validator';

export class UpdateLeadStatusDto {
  @IsString()
  @IsNotEmpty()
  status: string;
}
