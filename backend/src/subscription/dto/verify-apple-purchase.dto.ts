import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyApplePurchaseDto {
  @ApiProperty({ description: 'Base64 encoded App Store receipt' })
  @IsString()
  receiptData: string;
}
