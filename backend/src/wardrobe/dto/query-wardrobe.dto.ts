import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsNumber, IsBoolean, Min, Max } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ClothingCategory, Season } from '../../database/entities/wardrobe-item.entity';

export class QueryWardrobeDto {
  @ApiProperty({ enum: ClothingCategory, required: false })
  @IsEnum(ClothingCategory)
  @IsOptional()
  category?: ClothingCategory;

  @ApiProperty({ example: 'blue', required: false })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ enum: Season, required: false })
  @IsEnum(Season)
  @IsOptional()
  season?: Season;

  @ApiProperty({ example: 'casual', required: false })
  @IsString()
  @IsOptional()
  occasion?: string;

  @ApiProperty({ example: 'Nike', required: false })
  @IsString()
  @IsOptional()
  brand?: string;

  @ApiProperty({ example: 1, minimum: 1, maximum: 10, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(10)
  minFormality?: number;

  @ApiProperty({ example: 5, minimum: 1, maximum: 10, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(10)
  maxFormality?: number;

  @ApiProperty({ example: true, required: false })
  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  isFavorite?: boolean;

  @ApiProperty({ example: 'blue shirt', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({
    example: 'createdAt',
    enum: ['createdAt', 'timesWorn', 'lastWornAt', 'price', 'name'],
    required: false,
  })
  @IsString()
  @IsOptional()
  sortBy?: string;

  @ApiProperty({ example: 'DESC', enum: ['ASC', 'DESC'], required: false })
  @IsString()
  @IsOptional()
  sortOrder?: 'ASC' | 'DESC';

  @ApiProperty({ example: 1, minimum: 1, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  page?: number;

  @ApiProperty({ example: 20, minimum: 1, maximum: 100, required: false })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Min(1)
  @Max(100)
  limit?: number;
}
