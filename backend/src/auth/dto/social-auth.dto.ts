import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsIn, IsOptional } from 'class-validator';

export class SocialAuthDto {
  @ApiProperty({ example: 'google', enum: ['google', 'apple'] })
  @IsString()
  @IsIn(['google', 'apple'])
  provider: 'google' | 'apple';

  @ApiProperty({ example: 'oauth_token_here' })
  @IsString()
  token: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: '1234567890' })
  @IsString()
  providerId: string;
}
