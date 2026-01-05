import { Repository } from 'typeorm';
import { User } from '../database/entities/user.entity';
import { StyleProfile } from '../database/entities/style-profile.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateStyleProfileDto } from './dto/update-style-profile.dto';
export declare class UsersService {
    private readonly userRepository;
    private readonly styleProfileRepository;
    constructor(userRepository: Repository<User>, styleProfileRepository: Repository<StyleProfile>);
    findById(id: string): Promise<User>;
    updateUser(userId: string, updateUserDto: UpdateUserDto): Promise<User>;
    updateAvatar(userId: string, avatarUrl: string): Promise<User>;
    deleteUser(userId: string): Promise<void>;
    getStyleProfile(userId: string): Promise<StyleProfile>;
    updateStyleProfile(userId: string, updateDto: UpdateStyleProfileDto): Promise<StyleProfile>;
    getUserStats(userId: string): Promise<{
        totalItems: number;
        totalOutfits: number;
        itemsAddedThisMonth: number;
    }>;
}
