import { UsersService } from './users.service';
import { User } from '../database/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateStyleProfileDto } from './dto/update-style-profile.dto';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    getProfile(user: User): Promise<User>;
    updateProfile(user: User, updateUserDto: UpdateUserDto): Promise<User>;
    uploadAvatar(user: User, file: Express.Multer.File): Promise<User>;
    deleteAccount(user: User): Promise<{
        message: string;
    }>;
    getStyleProfile(user: User): Promise<import("../database/entities").StyleProfile>;
    updateStyleProfile(user: User, updateDto: UpdateStyleProfileDto): Promise<import("../database/entities").StyleProfile>;
    getUserStats(user: User): Promise<{
        totalItems: number;
        totalOutfits: number;
        itemsAddedThisMonth: number;
    }>;
}
