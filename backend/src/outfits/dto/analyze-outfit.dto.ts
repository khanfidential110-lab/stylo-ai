import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, IsUUID } from 'class-validator';

export class AnalyzeOutfitDto {
  @ApiProperty({ example: 'https://cdn.stylo-ai.com/outfit.jpg', required: false })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({ example: 'date night', required: false })
  @IsString()
  @IsOptional()
  occasion?: string;

  @ApiProperty({ example: ['uuid-1', 'uuid-2'], required: false })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  itemIds?: string[];
}
