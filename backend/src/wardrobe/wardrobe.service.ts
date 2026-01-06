import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, Like, Between } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { WardrobeItem, ClothingCategory, Season } from '../database/entities/wardrobe-item.entity';
import { User, SubscriptionTier } from '../database/entities/user.entity';
import { CreateWardrobeItemDto } from './dto/create-wardrobe-item.dto';
import { UpdateWardrobeItemDto } from './dto/update-wardrobe-item.dto';
import { QueryWardrobeDto } from './dto/query-wardrobe.dto';
import { AiService } from './ai.service';

@Injectable()
export class WardrobeService {
  constructor(
    @InjectRepository(WardrobeItem)
    private readonly wardrobeRepository: Repository<WardrobeItem>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly aiService: AiService,
    private readonly configService: ConfigService,
  ) { }

  async create(
    userId: string,
    createDto: CreateWardrobeItemDto,
    imageUrl: string,
  ): Promise<WardrobeItem> {
    // Check item limit for free users
    await this.checkItemLimit(userId);

    // Process image with AI
    const aiAnalysis = await this.aiService.analyzeClothingImage(imageUrl);

    const item = this.wardrobeRepository.create({
      userId,
      originalImageUrl: imageUrl,
      processedImageUrl: aiAnalysis.processedImageUrl,
      thumbnailUrl: aiAnalysis.thumbnailUrl,
      name: createDto.name || aiAnalysis.suggestedName,
      category: createDto.category || aiAnalysis.category,
      subcategory: createDto.subcategory || aiAnalysis.subcategory,
      primaryColor: createDto.primaryColor || aiAnalysis.primaryColor,
      primaryColorHex: aiAnalysis.primaryColorHex,
      secondaryColors: aiAnalysis.secondaryColors,
      pattern: aiAnalysis.pattern,
      material: createDto.material || aiAnalysis.material,
      season: createDto.season || aiAnalysis.season,
      occasions: createDto.occasions || aiAnalysis.occasions,
      formalityScore: aiAnalysis.formalityScore,
      brand: createDto.brand,
      size: createDto.size,
      price: createDto.price,
      tags: createDto.tags || [],
      aiMetadata: aiAnalysis.metadata,
    });

    return this.wardrobeRepository.save(item);
  }

  async analyzeClothing(imageUrl: string) {
    return this.aiService.analyzeClothingImage(imageUrl);
  }

  async findAll(userId: string, query: QueryWardrobeDto) {
    const {
      category,
      color,
      season,
      occasion,
      brand,
      minFormality,
      maxFormality,
      isFavorite,
      search,
      sortBy = 'createdAt',
      sortOrder = 'DESC',
      page = 1,
      limit = 20,
    } = query;

    const queryBuilder = this.wardrobeRepository
      .createQueryBuilder('item')
      .where('item.userId = :userId', { userId });

    if (category) {
      queryBuilder.andWhere('item.category = :category', { category });
    }

    if (color) {
      queryBuilder.andWhere(
        '(item.primaryColor ILIKE :color OR item.secondaryColors::text ILIKE :color)',
        { color: `%${color}%` },
      );
    }

    if (season) {
      queryBuilder.andWhere(':season = ANY(item.season)', { season });
    }

    if (occasion) {
      queryBuilder.andWhere(':occasion = ANY(item.occasions)', { occasion });
    }

    if (brand) {
      queryBuilder.andWhere('item.brand ILIKE :brand', { brand: `%${brand}%` });
    }

    if (minFormality !== undefined) {
      queryBuilder.andWhere('item.formalityScore >= :minFormality', { minFormality });
    }

    if (maxFormality !== undefined) {
      queryBuilder.andWhere('item.formalityScore <= :maxFormality', { maxFormality });
    }

    if (isFavorite !== undefined) {
      queryBuilder.andWhere('item.isFavorite = :isFavorite', { isFavorite });
    }

    if (search) {
      queryBuilder.andWhere(
        '(item.name ILIKE :search OR item.brand ILIKE :search OR item.tags::text ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Sorting
    const validSortFields = ['createdAt', 'timesWorn', 'lastWornAt', 'price', 'name'];
    const sortField = validSortFields.includes(sortBy) ? sortBy : 'createdAt';
    queryBuilder.orderBy(`item.${sortField}`, sortOrder === 'ASC' ? 'ASC' : 'DESC');

    // Pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(userId: string, itemId: string): Promise<WardrobeItem> {
    const item = await this.wardrobeRepository.findOne({
      where: { id: itemId, userId },
    });

    if (!item) {
      throw new NotFoundException('Wardrobe item not found');
    }

    return item;
  }

  async update(
    userId: string,
    itemId: string,
    updateDto: UpdateWardrobeItemDto,
  ): Promise<WardrobeItem> {
    const item = await this.findOne(userId, itemId);
    Object.assign(item, updateDto);
    return this.wardrobeRepository.save(item);
  }

  async delete(userId: string, itemId: string): Promise<void> {
    const result = await this.wardrobeRepository.delete({ id: itemId, userId });
    if (result.affected === 0) {
      throw new NotFoundException('Wardrobe item not found');
    }
  }

  async toggleFavorite(userId: string, itemId: string): Promise<WardrobeItem> {
    const item = await this.findOne(userId, itemId);
    item.isFavorite = !item.isFavorite;
    return this.wardrobeRepository.save(item);
  }

  async markAsWorn(userId: string, itemId: string): Promise<WardrobeItem> {
    const item = await this.findOne(userId, itemId);
    item.timesWorn += 1;
    item.lastWornAt = new Date();
    return this.wardrobeRepository.save(item);
  }

  async getStatistics(userId: string) {
    const items = await this.wardrobeRepository.find({ where: { userId } });

    // Category distribution
    const categoryCount: Record<string, number> = {};
    items.forEach((item) => {
      categoryCount[item.category] = (categoryCount[item.category] || 0) + 1;
    });

    // Color distribution
    const colorCount: Record<string, number> = {};
    items.forEach((item) => {
      if (item.primaryColor) {
        colorCount[item.primaryColor] = (colorCount[item.primaryColor] || 0) + 1;
      }
    });

    // Most and least worn
    const sortedByWear = [...items].sort((a, b) => b.timesWorn - a.timesWorn);
    const mostWorn = sortedByWear.slice(0, 10);
    const leastWorn = sortedByWear.slice(-10).reverse();

    // Unworn items
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);
    const ninetyDaysAgo = new Date();
    ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

    const unworn30Days = items.filter(
      (item) => !item.lastWornAt || item.lastWornAt < thirtyDaysAgo,
    ).length;
    const unworn60Days = items.filter(
      (item) => !item.lastWornAt || item.lastWornAt < sixtyDaysAgo,
    ).length;
    const unworn90Days = items.filter(
      (item) => !item.lastWornAt || item.lastWornAt < ninetyDaysAgo,
    ).length;

    // Total value
    const totalValue = items.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

    // Cost per wear
    const costPerWear = items
      .filter((item) => item.price && item.timesWorn > 0)
      .map((item) => ({
        id: item.id,
        name: item.name,
        costPerWear: Number(item.price) / item.timesWorn,
      }))
      .sort((a, b) => a.costPerWear - b.costPerWear);

    return {
      totalItems: items.length,
      categoryDistribution: categoryCount,
      colorDistribution: colorCount,
      mostWorn: mostWorn.map((i) => ({ id: i.id, name: i.name, timesWorn: i.timesWorn })),
      leastWorn: leastWorn.map((i) => ({ id: i.id, name: i.name, timesWorn: i.timesWorn })),
      unwornStats: {
        last30Days: unworn30Days,
        last60Days: unworn60Days,
        last90Days: unworn90Days,
      },
      totalValue,
      topCostPerWear: costPerWear.slice(0, 10),
      worstCostPerWear: costPerWear.slice(-10).reverse(),
    };
  }

  async bulkCreate(
    userId: string,
    items: { imageUrl: string; data?: Partial<CreateWardrobeItemDto> }[],
  ): Promise<WardrobeItem[]> {
    const createdItems: WardrobeItem[] = [];

    for (const item of items) {
      try {
        const created = await this.create(
          userId,
          item.data as CreateWardrobeItemDto,
          item.imageUrl,
        );
        createdItems.push(created);
      } catch (error) {
        // Continue with other items if one fails
        console.error(`Failed to create item: ${error.message}`);
      }
    }

    return createdItems;
  }

  async getItemsByIds(userId: string, itemIds: string[]): Promise<WardrobeItem[]> {
    return this.wardrobeRepository.find({
      where: { id: In(itemIds), userId },
    });
  }

  async getItemsForWeather(
    userId: string,
    temperature: number,
    conditions: string,
  ): Promise<WardrobeItem[]> {
    // Determine appropriate seasons based on temperature
    let seasons: Season[] = [];
    if (temperature < 45) {
      seasons = [Season.WINTER, Season.ALL_SEASON];
    } else if (temperature < 60) {
      seasons = [Season.FALL, Season.SPRING, Season.ALL_SEASON];
    } else if (temperature < 75) {
      seasons = [Season.SPRING, Season.FALL, Season.ALL_SEASON];
    } else {
      seasons = [Season.SUMMER, Season.ALL_SEASON];
    }

    const items = await this.wardrobeRepository
      .createQueryBuilder('item')
      .where('item.userId = :userId', { userId })
      .andWhere('item.season && :seasons', { seasons })
      .getMany();

    return items;
  }

  private async checkItemLimit(userId: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    const limits = this.configService.get('limits');
    const tierLimits = limits[user.subscriptionTier];

    if (tierLimits.wardrobeItems === -1) {
      return; // Unlimited
    }

    const currentCount = await this.wardrobeRepository.count({ where: { userId } });
    if (currentCount >= tierLimits.wardrobeItems) {
      throw new ForbiddenException(
        `You have reached the limit of ${tierLimits.wardrobeItems} items. Upgrade to add more.`,
      );
    }
  }
}
