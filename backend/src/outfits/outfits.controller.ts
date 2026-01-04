import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { OutfitsService } from './outfits.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../database/entities/user.entity';
import { CreateOutfitDto } from './dto/create-outfit.dto';
import { RecommendOutfitDto } from './dto/recommend-outfit.dto';
import { AnalyzeOutfitDto } from './dto/analyze-outfit.dto';
import { RateOutfitDto } from './dto/rate-outfit.dto';
import { PlanOutfitDto } from './dto/plan-outfit.dto';
import { CalendarQueryDto } from './dto/calendar-query.dto';

@ApiTags('outfits')
@Controller('outfits')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class OutfitsController {
  constructor(private readonly outfitsService: OutfitsService) {}

  @Post('recommend')
  @ApiOperation({ summary: 'Get AI outfit recommendations' })
  @ApiResponse({ status: 200, description: 'Returns outfit recommendations' })
  async recommend(
    @CurrentUser() user: User,
    @Body() recommendDto: RecommendOutfitDto,
  ) {
    return this.outfitsService.recommend(user.id, recommendDto);
  }

  @Post('analyze')
  @ApiOperation({ summary: 'Analyze an outfit from photo' })
  @ApiResponse({ status: 200, description: 'Returns outfit analysis' })
  async analyze(
    @CurrentUser() user: User,
    @Body() analyzeDto: AnalyzeOutfitDto,
  ) {
    return this.outfitsService.analyze(user.id, analyzeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get saved outfits' })
  @ApiResponse({ status: 200, description: 'Returns saved outfits' })
  async findAll(
    @CurrentUser() user: User,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.outfitsService.findAll(user.id, page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single outfit' })
  @ApiResponse({ status: 200, description: 'Returns outfit' })
  async findOne(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.outfitsService.findOne(user.id, id);
  }

  @Post()
  @ApiOperation({ summary: 'Save an outfit' })
  @ApiResponse({ status: 201, description: 'Outfit saved' })
  async save(@CurrentUser() user: User, @Body() createDto: CreateOutfitDto) {
    return this.outfitsService.save(user.id, createDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a saved outfit' })
  @ApiResponse({ status: 200, description: 'Outfit deleted' })
  async delete(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.outfitsService.delete(user.id, id);
    return { message: 'Outfit deleted successfully' };
  }

  @Post(':id/wear')
  @ApiOperation({ summary: 'Mark outfit as worn' })
  @ApiResponse({ status: 200, description: 'Outfit marked as worn' })
  async markAsWorn(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body('date') date?: Date,
  ) {
    return this.outfitsService.markAsWorn(user.id, id, date);
  }

  @Post(':id/rate')
  @ApiOperation({ summary: 'Rate an outfit' })
  @ApiResponse({ status: 200, description: 'Outfit rated' })
  async rate(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() rateDto: RateOutfitDto,
  ) {
    return this.outfitsService.rate(user.id, id, rateDto.rating);
  }

  // Calendar endpoints
  @Get('calendar')
  @ApiOperation({ summary: 'Get outfit calendar' })
  @ApiResponse({ status: 200, description: 'Returns calendar entries' })
  async getCalendar(
    @CurrentUser() user: User,
    @Query() query: CalendarQueryDto,
  ) {
    return this.outfitsService.getCalendar(user.id, query.startDate, query.endDate);
  }

  @Post('calendar')
  @ApiOperation({ summary: 'Plan outfit for a date' })
  @ApiResponse({ status: 201, description: 'Outfit planned' })
  async planOutfit(
    @CurrentUser() user: User,
    @Body() planDto: PlanOutfitDto,
  ) {
    return this.outfitsService.planOutfit(
      user.id,
      planDto.date,
      planDto.outfitId,
      planDto.occasion,
    );
  }

  @Delete('calendar/:date')
  @ApiOperation({ summary: 'Remove outfit from calendar' })
  @ApiResponse({ status: 200, description: 'Calendar entry removed' })
  async removeFromCalendar(
    @CurrentUser() user: User,
    @Param('date') date: string,
  ) {
    await this.outfitsService.removeFromCalendar(user.id, new Date(date));
    return { message: 'Removed from calendar' };
  }
}
