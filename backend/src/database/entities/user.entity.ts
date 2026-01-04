import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { WardrobeItem } from './wardrobe-item.entity';
import { Outfit } from './outfit.entity';
import { StyleProfile } from './style-profile.entity';
import { Subscription } from './subscription.entity';
import { ChatMessage } from './chat-message.entity';

export enum TemperatureUnit {
  FAHRENHEIT = 'fahrenheit',
  CELSIUS = 'celsius',
}

export enum SubscriptionTier {
  FREE = 'free',
  PREMIUM = 'premium',
  PREMIUM_PLUS = 'premium_plus',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true })
  name: string;

  @Column({ name: 'avatar_url', nullable: true })
  avatarUrl: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  timezone: string;

  @Column({
    name: 'temperature_unit',
    type: 'enum',
    enum: TemperatureUnit,
    default: TemperatureUnit.FAHRENHEIT,
  })
  temperatureUnit: TemperatureUnit;

  @Column({
    name: 'subscription_tier',
    type: 'enum',
    enum: SubscriptionTier,
    default: SubscriptionTier.FREE,
  })
  subscriptionTier: SubscriptionTier;

  @Column({ name: 'subscription_expires_at', nullable: true })
  subscriptionExpiresAt: Date;

  @Column({ name: 'google_id', nullable: true })
  googleId: string;

  @Column({ name: 'apple_id', nullable: true })
  appleId: string;

  @Column({ name: 'email_verified', default: false })
  emailVerified: boolean;

  @Column({ name: 'refresh_token', nullable: true })
  refreshToken: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @OneToMany(() => WardrobeItem, (item) => item.user)
  wardrobeItems: WardrobeItem[];

  @OneToMany(() => Outfit, (outfit) => outfit.user)
  outfits: Outfit[];

  @OneToOne(() => StyleProfile, (profile) => profile.user)
  styleProfile: StyleProfile;

  @OneToMany(() => Subscription, (subscription) => subscription.user)
  subscriptions: Subscription[];

  @OneToMany(() => ChatMessage, (message) => message.user)
  chatMessages: ChatMessage[];
}
