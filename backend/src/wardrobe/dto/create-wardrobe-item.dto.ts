import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsNumber,
  Min,
  Max,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ClothingCategory, Pattern, Season } from '../../database/entities/wardrobe-item.entity';

export class CreateWardrobeItemDto {
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

  @ApiProperty({ example: 'cotton', required: false })
  @IsString()
  @IsOptional()
  material?: string;

  @ApiProperty({ example: 'Blue', required: false })
  @IsString()
  @IsOptional()
  primaryColor?: string;

  @ApiProperty({ enum: Season, isArray: true, required: false })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try { return JSON.parse(value); } catch (e) { return value.split(','); }
    }
    return value;
  })
  @IsArray()
  @IsEnum(Season, { each: true })
  @IsOptional()
  season?: Season[];

  @ApiProperty({ example: ['casual', 'work'], required: false })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try { return JSON.parse(value); } catch (e) { return value.split(','); }
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  occasions?: string[];

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
  @Transform(({ value }) => Number(value))
  price?: number;

  @ApiProperty({ example: ['favorite', 'summer'], required: false })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try { return JSON.parse(value); } catch (e) { return value.split(','); }
    }
    return value;
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];
}
