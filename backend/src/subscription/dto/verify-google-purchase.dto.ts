import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class VerifyGooglePurchaseDto {
  @ApiProperty({ description: 'Google Play purchase token' })
  @IsString()
  purchaseToken: string;

  @ApiProperty({ description: 'Product ID (e.g., premium_monthly)' })
  @IsString()
  productId: string;
}
