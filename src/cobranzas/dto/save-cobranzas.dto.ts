import { IsArray, ArrayMinSize } from 'class-validator';

export class SaveCobranzasDto {
  @IsArray()
  @ArrayMinSize(1)
  rows!: Record<string, any>[];
}