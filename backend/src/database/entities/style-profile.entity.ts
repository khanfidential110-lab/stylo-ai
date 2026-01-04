import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('style_profiles')
export class StyleProfile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @OneToOne(() => User, (user) => user.styleProfile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'style_tags', type: 'text', array: true, default: [] })
  styleTags: string[];

  @Column({ name: 'preferred_colors', type: 'text', array: true, default: [] })
  preferredColors: string[];

  @Column({ name: 'avoided_colors', type: 'text', array: true, default: [] })
  avoidedColors: string[];

  @Column({ name: 'formality_preference', nullable: true })
  formalityPreference: number;

  @Column({ name: 'preferred_brands', type: 'text', array: true, default: [] })
  preferredBrands: string[];

  @Column({ name: 'body_type', nullable: true })
  bodyType: string;

  @Column({ nullable: true })
  height: string;

  @Column({ name: 'preferred_fit', nullable: true })
  preferredFit: string;

  @Column({ name: 'style_inspirations', type: 'text', array: true, default: [] })
  styleInspirations: string[];

  @Column({ name: 'occasions_priority', type: 'jsonb', nullable: true })
  occasionsPriority: { occasion: string; frequency: number }[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
