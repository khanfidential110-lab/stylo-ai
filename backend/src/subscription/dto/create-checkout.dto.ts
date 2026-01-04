import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsIn } from 'class-validator';

export class CreateCheckoutDto {
  @ApiProperty({
    example: 'premium_monthly',
    enum: ['premium_monthly', 'premium_yearly', 'premium_plus_monthly', 'premium_plus_yearly'],
  })
  @IsString()
  @IsIn(['premium_monthly', 'premium_yearly', 'premium_plus_monthly', 'premium_plus_yearly'])
  planId: string;
}
