import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class RecommendOutfitDto {
  @ApiProperty({ example: 'work', required: false })
  @IsString()
  @IsOptional()
  occasion?: string;

  @ApiProperty({ example: 'New York', required: false })
  @IsString()
  @IsOptional()
  city?: string;

  @ApiProperty({ required: false })
  @IsDate()
  @IsOptional()
  @Type(() => Date)
  date?: Date;
}
