import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

export enum ClothingCategory {
  TOPS = 'tops',
  BOTTOMS = 'bottoms',
  DRESSES = 'dresses',
  OUTERWEAR = 'outerwear',
  FOOTWEAR = 'footwear',
  ACCESSORIES = 'accessories',
  ACTIVEWEAR = 'activewear',
  SWIMWEAR = 'swimwear',
  SLEEPWEAR = 'sleepwear',
  FORMAL = 'formal',
}

export enum Season {
  SPRING = 'spring',
  SUMMER = 'summer',
  FALL = 'fall',
  WINTER = 'winter',
  ALL_SEASON = 'all-season',
}

export enum Pattern {
  SOLID = 'solid',
  STRIPED = 'striped',
  FLORAL = 'floral',
  PLAID = 'plaid',
  GEOMETRIC = 'geometric',
  POLKA_DOT = 'polka-dot',
  ABSTRACT = 'abstract',
  ANIMAL_PRINT = 'animal-print',
  CAMO = 'camo',
  TIE_DYE = 'tie-dye',
}

@Entity('wardrobe_items')
export class WardrobeItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.wardrobeItems, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  name: string;

  @Column({
    type: 'enum',
    enum: ClothingCategory,
  })
  category: ClothingCategory;

  @Column({ nullable: true })
  subcategory: string;

  @Column({ name: 'original_image_url' })
  originalImageUrl: string;

  @Column({ name: 'processed_image_url', nullable: true })
  processedImageUrl: string;

  @Column({ name: 'thumbnail_url', nullable: true })
  thumbnailUrl: string;

  @Column({ name: 'primary_color', nullable: true })
  primaryColor: string;

  @Column({ name: 'primary_color_hex', nullable: true })
  primaryColorHex: string;

  @Column({ name: 'secondary_colors', type: 'jsonb', nullable: true })
  secondaryColors: { name: string; hex: string }[];

  @Column({
    type: 'enum',
    enum: Pattern,
    nullable: true,
  })
  pattern: Pattern;

  @Column({ nullable: true })
  material: string;

  @Column({ type: 'enum', enum: Season, array: true, default: [] })
  season: Season[];

  @Column({ type: 'text', array: true, default: [] })
  occasions: string[];

  @Column({ name: 'formality_score', nullable: true })
  formalityScore: number;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  size: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  price: number;

  @Column({ name: 'is_favorite', default: false })
  isFavorite: boolean;

  @Column({ name: 'times_worn', default: 0 })
  timesWorn: number;

  @Column({ name: 'last_worn_at', type: 'date', nullable: true })
  lastWornAt: Date;

  @Column({ type: 'text', array: true, default: [] })
  tags: string[];

  @Column({ type: 'jsonb', name: 'ai_metadata', nullable: true })
  aiMetadata: Record<string, any>;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
