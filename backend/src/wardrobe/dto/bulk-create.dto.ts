import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ValidateNested, IsString, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateWardrobeItemDto } from './create-wardrobe-item.dto';

class BulkItemDto {
  @ApiProperty({ example: 'https://cdn.stylo-ai.com/wardrobe/item.jpg' })
  @IsString()
  imageUrl: string;

  @ApiProperty({ required: false })
  @ValidateNested()
  @Type(() => CreateWardrobeItemDto)
  @IsOptional()
  data?: CreateWardrobeItemDto;
}

export class BulkCreateDto {
  @ApiProperty({ type: [BulkItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkItemDto)
  items: BulkItemDto[];
}
