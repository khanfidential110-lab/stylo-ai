import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsIn } from 'class-validator';

export class RestorePurchasesDto {
  @ApiProperty({ enum: ['apple', 'google'] })
  @IsString()
  @IsIn(['apple', 'google'])
  platform: 'apple' | 'google';

  @ApiProperty({ description: 'Array of receipts/tokens to verify' })
  @IsArray()
  @IsString({ each: true })
  receipts: string[];
}
