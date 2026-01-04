import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { StyleProfile } from '../database/entities/style-profile.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateStyleProfileDto } from './dto/update-style-profile.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(StyleProfile)
    private readonly styleProfileRepository: Repository<StyleProfile>,
  ) {}

  async findById(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['styleProfile'],
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(userId, updateUserDto);
    return this.findById(userId);
  }

  async updateAvatar(userId: string, avatarUrl: string): Promise<User> {
    await this.userRepository.update(userId, { avatarUrl });
    return this.findById(userId);
  }

  async deleteUser(userId: string): Promise<void> {
    const result = await this.userRepository.delete(userId);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async getStyleProfile(userId: string): Promise<StyleProfile> {
    let profile = await this.styleProfileRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      profile = this.styleProfileRepository.create({ userId });
      await this.styleProfileRepository.save(profile);
    }

    return profile;
  }

  async updateStyleProfile(
    userId: string,
    updateDto: UpdateStyleProfileDto,
  ): Promise<StyleProfile> {
    let profile = await this.styleProfileRepository.findOne({
      where: { userId },
    });

    if (!profile) {
      profile = this.styleProfileRepository.create({ userId, ...updateDto });
    } else {
      Object.assign(profile, updateDto);
    }

    return this.styleProfileRepository.save(profile);
  }

  async getUserStats(userId: string): Promise<{
    totalItems: number;
    totalOutfits: number;
    itemsAddedThisMonth: number;
  }> {
    // This would be implemented with actual queries
    return {
      totalItems: 0,
      totalOutfits: 0,
      itemsAddedThisMonth: 0,
    };
  }
}
