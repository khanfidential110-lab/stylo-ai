import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsNumber,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ClothingCategory, Pattern, Season } from '../../database/entities/wardrobe-item.entity';

export class UpdateWardrobeItemDto {
  @ApiProperty({ example: 'Navy Blue T-Shirt', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ enum: ClothingCategory, required: false })
  @IsEnum(ClothingCategory)
  @IsOptional()
  category?: ClothingCategory;

  @ApiProperty({ example: 't-shirt', required: false })
  @IsString()
  @IsOptional()
  subcategory?: string;

  @ApiProperty({ example: 'blue', required: false })
  @IsString()
  @IsOptional()
  primaryColor?: string;

  @ApiProperty({ enum: Pattern, required: false })
  @IsEnum(Pattern)
  @IsOptional()
  pattern?: Pattern;

  @ApiProperty({ example: 'cotton', required: false })
  @IsString()
  @IsOptional()
  material?: string;

  @ApiProperty({ enum: Season, isArray: true, required: false })
  @IsArray()
  @IsEnum(Season, { each: true })
  @IsOptional()
  season?: Season[];

  @ApiProperty({ example: ['casual', 'work'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  occasions?: string[];

  @ApiProperty({ example: 5, minimum: 1, maximum: 10, required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(10)
  formalityScore?: number;

  @ApiProperty({ example: 'Nike', required: false })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({ example: 'M', required: false })
  @IsString()
  @IsOptional()
  size?: string;

  @ApiProperty({ example: 49.99, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  price?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  isFavorite?: boolean;

  @ApiProperty({ example: ['favorite', 'summer'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
