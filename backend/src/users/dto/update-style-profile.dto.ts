import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class UpdateStyleProfileDto {
  @ApiProperty({ example: ['casual', 'minimalist', 'streetwear'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  styleTags?: string[];

  @ApiProperty({ example: ['black', 'navy', 'white'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  preferredColors?: string[];

  @ApiProperty({ example: ['neon', 'bright yellow'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  avoidedColors?: string[];

  @ApiProperty({ example: 5, minimum: 1, maximum: 10, required: false })
  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(10)
  formalityPreference?: number;

  @ApiProperty({ example: ['Nike', 'Zara', 'H&M'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  preferredBrands?: string[];

  @ApiProperty({ example: 'athletic', required: false })
  @IsString()
  @IsOptional()
  bodyType?: string;

  @ApiProperty({ example: '5\'10"', required: false })
  @IsString()
  @IsOptional()
  height?: string;

  @ApiProperty({ example: 'slim fit', required: false })
  @IsString()
  @IsOptional()
  preferredFit?: string;

  @ApiProperty({ example: ['Chris Hemsworth', 'Ryan Gosling'], required: false })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  styleInspirations?: string[];
}
