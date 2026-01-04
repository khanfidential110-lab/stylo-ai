import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class OutfitItemDto {
  @ApiProperty({ example: 'uuid-of-item' })
  @IsString()
  itemId: string;

  @ApiProperty({ example: 'top' })
  @IsString()
  position: string;
}

export class CreateOutfitDto {
  @ApiProperty({ example: 'Casual Friday Look', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ type: [OutfitItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OutfitItemDto)
  items: OutfitItemDto[];

  @ApiProperty({ example: 'work', required: false })
  @IsString()
  @IsOptional()
  occasion?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
