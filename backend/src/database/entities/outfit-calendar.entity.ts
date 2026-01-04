import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { User } from './user.entity';
import { Outfit } from './outfit.entity';

@Entity('outfit_calendar')
@Unique(['userId', 'date'])
export class OutfitCalendar {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'outfit_id' })
  outfitId: string;

  @ManyToOne(() => Outfit, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'outfit_id' })
  outfit: Outfit;

  @Column({ type: 'date' })
  date: Date;

  @Column({ nullable: true })
  occasion: string;

  @Column({ name: 'weather_data', type: 'jsonb', nullable: true })
  weatherData: {
    temperature: number;
    feelsLike: number;
    condition: string;
    humidity: number;
    forecast?: string;
  };

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
