import { ApiProperty } from '@nestjs/swagger';
import { IsDate } from 'class-validator';
import { Type } from 'class-transformer';

export class CalendarQueryDto {
  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty()
  @IsDate()
  @Type(() => Date)
  endDate: Date;
}
