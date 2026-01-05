"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../database/entities/user.entity");
const style_profile_entity_1 = require("../database/entities/style-profile.entity");
let UsersService = class UsersService {
    constructor(userRepository, styleProfileRepository) {
        this.userRepository = userRepository;
        this.styleProfileRepository = styleProfileRepository;
    }
    async findById(id) {
        const user = await this.userRepository.findOne({
            where: { id },
            relations: ['styleProfile'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async updateUser(userId, updateUserDto) {
        await this.userRepository.update(userId, updateUserDto);
        return this.findById(userId);
    }
    async updateAvatar(userId, avatarUrl) {
        await this.userRepository.update(userId, { avatarUrl });
        return this.findById(userId);
    }
    async deleteUser(userId) {
        const result = await this.userRepository.delete(userId);
        if (result.affected === 0) {
            throw new common_1.NotFoundException('User not found');
        }
    }
    async getStyleProfile(userId) {
        let profile = await this.styleProfileRepository.findOne({
            where: { userId },
        });
        if (!profile) {
            profile = this.styleProfileRepository.create({ userId });
            await this.styleProfileRepository.save(profile);
        }
        return profile;
    }
    async updateStyleProfile(userId, updateDto) {
        let profile = await this.styleProfileRepository.findOne({
            where: { userId },
        });
        if (!profile) {
            profile = this.styleProfileRepository.create({ userId, ...updateDto });
        }
        else {
            Object.assign(profile, updateDto);
        }
        return this.styleProfileRepository.save(profile);
    }
    async getUserStats(userId) {
        return {
            totalItems: 0,
            totalOutfits: 0,
            itemsAddedThisMonth: 0,
        };
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(style_profile_entity_1.StyleProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map