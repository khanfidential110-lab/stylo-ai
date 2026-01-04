import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
} from '@nestjs/swagger';
import { WardrobeService } from './wardrobe.service';
import { OutfitDetectionService } from './outfit-detection.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../database/entities/user.entity';
import { CreateWardrobeItemDto } from './dto/create-wardrobe-item.dto';
import { UpdateWardrobeItemDto } from './dto/update-wardrobe-item.dto';
import { QueryWardrobeDto } from './dto/query-wardrobe.dto';
import { BulkCreateDto } from './dto/bulk-create.dto';
import { DetectItemsDto, SaveDetectedItemsDto } from './dto/detect-items.dto';

@ApiTags('wardrobe')
@Controller('wardrobe')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WardrobeController {
  constructor(
    private readonly wardrobeService: WardrobeService,
    private readonly outfitDetectionService: OutfitDetectionService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all wardrobe items with filters' })
  @ApiResponse({ status: 200, description: 'Returns paginated wardrobe items' })
  async findAll(@CurrentUser() user: User, @Query() query: QueryWardrobeDto) {
    return this.wardrobeService.findAll(user.id, query);
  }

  @Get('statistics')
  @ApiOperation({ summary: 'Get wardrobe statistics' })
  @ApiResponse({ status: 200, description: 'Returns wardrobe analytics' })
  async getStatistics(@CurrentUser() user: User) {
    return this.wardrobeService.getStatistics(user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single wardrobe item' })
  @ApiResponse({ status: 200, description: 'Returns wardrobe item' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async findOne(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.wardrobeService.findOne(user.id, id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Add a new wardrobe item' })
  @ApiResponse({ status: 201, description: 'Item created' })
  @ApiResponse({ status: 403, description: 'Item limit reached' })
  async create(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
    @Body() createDto: CreateWardrobeItemDto,
  ) {
    // In production, upload to S3 first
    const imageUrl = `https://cdn.stylo-ai.com/wardrobe/${user.id}/original/${file?.filename || 'temp.jpg'}`;
    return this.wardrobeService.create(user.id, createDto, imageUrl);
  }

  @Post('bulk')
  @ApiOperation({ summary: 'Bulk upload wardrobe items' })
  @ApiResponse({ status: 201, description: 'Items created' })
  async bulkCreate(@CurrentUser() user: User, @Body() bulkDto: BulkCreateDto) {
    return this.wardrobeService.bulkCreate(user.id, bulkDto.items);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a wardrobe item' })
  @ApiResponse({ status: 200, description: 'Item updated' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async update(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateWardrobeItemDto,
  ) {
    return this.wardrobeService.update(user.id, id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a wardrobe item' })
  @ApiResponse({ status: 200, description: 'Item deleted' })
  @ApiResponse({ status: 404, description: 'Item not found' })
  async delete(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    await this.wardrobeService.delete(user.id, id);
    return { message: 'Item deleted successfully' };
  }

  @Post(':id/favorite')
  @ApiOperation({ summary: 'Toggle favorite status' })
  @ApiResponse({ status: 200, description: 'Favorite toggled' })
  async toggleFavorite(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.wardrobeService.toggleFavorite(user.id, id);
  }

  @Post(':id/wear')
  @ApiOperation({ summary: 'Mark item as worn' })
  @ApiResponse({ status: 200, description: 'Item marked as worn' })
  async markAsWorn(
    @CurrentUser() user: User,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    return this.wardrobeService.markAsWorn(user.id, id);
  }

  @Post('detect')
  @ApiOperation({ summary: 'Detect clothing items from a full-body photo' })
  @ApiResponse({ status: 200, description: 'Returns detected items' })
  async detectItems(
    @CurrentUser() user: User,
    @Body() detectDto: DetectItemsDto,
  ) {
    const result = await this.outfitDetectionService.detectItemsFromPhoto(detectDto.imageUrl);

    // If autoSave is true, save all detected items
    if (detectDto.autoSave && result.detectedItems.length > 0) {
      const savedItems = await this.wardrobeService.bulkCreate(
        user.id,
        result.detectedItems.map((item) => ({
          imageUrl: item.croppedImageUrl || detectDto.imageUrl,
          data: {
            name: item.suggestedName,
            category: item.category,
            subcategory: item.subcategory,
          },
        })),
      );
      return { ...result, savedItems };
    }

    return result;
  }

  @Post('detect/save')
  @ApiOperation({ summary: 'Save selected detected items to wardrobe' })
  @ApiResponse({ status: 201, description: 'Items saved to wardrobe' })
  async saveDetectedItems(
    @CurrentUser() user: User,
    @Body() saveDto: SaveDetectedItemsDto,
  ) {
    const selectedItems = saveDto.items.filter((item) => item.selected !== false);

    const savedItems = await this.wardrobeService.bulkCreate(
      user.id,
      selectedItems.map((item) => ({
        imageUrl: item.croppedImageUrl || saveDto.originalImageUrl,
        data: {
          name: item.suggestedName,
          category: item.category as any,
          subcategory: item.subcategory,
        },
      })),
    );

    return {
      message: `${savedItems.length} items saved to wardrobe`,
      items: savedItems,
    };
  }
}
