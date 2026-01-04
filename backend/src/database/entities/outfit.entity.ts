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

export interface OutfitItem {
  itemId: string;
  position: string; // 'top', 'bottom', 'shoes', 'accessory', etc.
}

export interface OutfitFeedback {
  colorHarmony: {
    score: number;
    feedback: string;
  };
  styleCoherence: {
    score: number;
    feedback: string;
  };
  occasionFit: {
    score: number;
    feedback: string;
  };
  weatherSuitability: {
    score: number;
    feedback: string;
  };
  completeness: {
    score: number;
    feedback: string;
  };
  compliments: string[];
  suggestions: string[];
  alternatives: {
    itemId: string;
    reason: string;
    alternativeId?: string;
  }[];
  warnings: string[];
}

@Entity('outfits')
export class Outfit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, (user) => user.outfits, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ nullable: true })
  name: string;

  @Column({ type: 'jsonb' })
  items: OutfitItem[];

  @Column({ nullable: true })
  occasion: string;

  @Column({ name: 'overall_score', nullable: true })
  overallScore: number;

  @Column({ name: 'ai_feedback', type: 'jsonb', nullable: true })
  aiFeedback: OutfitFeedback;

  @Column({ name: 'outfit_image_url', nullable: true })
  outfitImageUrl: string;

  @Column({ name: 'is_saved', default: false })
  isSaved: boolean;

  @Column({ name: 'worn_date', type: 'date', nullable: true })
  wornDate: Date;

  @Column({ name: 'user_rating', nullable: true })
  userRating: number;

  @Column({ nullable: true })
  notes: string;

  @Column({ name: 'weather_data', type: 'jsonb', nullable: true })
  weatherData: {
    temperature: number;
    feelsLike: number;
    condition: string;
    humidity: number;
  };

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
