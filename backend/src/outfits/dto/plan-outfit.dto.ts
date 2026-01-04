import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class PlanOutfitDto {
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty()
  @IsUUID()
  outfitId: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  occasion?: string;
}
