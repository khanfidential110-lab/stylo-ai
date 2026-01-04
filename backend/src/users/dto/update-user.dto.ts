import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, MaxLength } from 'class-validator';
import { TemperatureUnit } from '../../database/entities/user.entity';

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  name?: string;

  @ApiProperty({ example: 'New York', required: false })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @ApiProperty({ example: 'America/New_York', required: false })
  @IsString()
  @IsOptional()
  timezone?: string;

  @ApiProperty({
    example: 'fahrenheit',
    enum: TemperatureUnit,
    required: false,
  })
  @IsEnum(TemperatureUnit)
  @IsOptional()
  temperatureUnit?: TemperatureUnit;
}
