import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsBoolean, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class DetectItemsDto {
  @ApiProperty({ description: 'URL of the full-body photo' })
  @IsString()
  imageUrl: string;

  @ApiProperty({ description: 'Auto-save detected items to wardrobe', default: false })
  @IsBoolean()
  @IsOptional()
  autoSave?: boolean;
}

class ConfirmItemDto {
  @ApiProperty()
  @IsString()
  suggestedName: string;

  @ApiProperty()
  @IsString()
  category: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  subcategory?: string;

  @ApiProperty()
  @IsString()
  primaryColor: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  croppedImageUrl?: string;

  @ApiProperty()
  @IsBoolean()
  @IsOptional()
  selected?: boolean;
}

export class SaveDetectedItemsDto {
  @ApiProperty({ description: 'Original photo URL' })
  @IsString()
  originalImageUrl: string;

  @ApiProperty({ type: [ConfirmItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConfirmItemDto)
  items: ConfirmItemDto[];
}
