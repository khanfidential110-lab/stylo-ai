import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AttachmentDto {
  @ApiProperty({ enum: ['image', 'outfit', 'wardrobe_item'] })
  @IsString()
  type: 'image' | 'outfit' | 'wardrobe_item';

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  url?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  itemId?: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  outfitId?: string;
}

export class SendMessageDto {
  @ApiProperty({ example: 'What should I wear to a job interview?' })
  @IsString()
  message: string;

  @ApiProperty({ required: false })
  @IsString()
  @IsOptional()
  conversationId?: string;

  @ApiProperty({ type: [AttachmentDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AttachmentDto)
  @IsOptional()
  attachments?: AttachmentDto[];
}
