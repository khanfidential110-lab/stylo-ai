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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const bcrypt = require("bcrypt");
const user_entity_1 = require("../database/entities/user.entity");
const style_profile_entity_1 = require("../database/entities/style-profile.entity");
let AuthService = class AuthService {
    constructor(userRepository, styleProfileRepository, jwtService, configService) {
        this.userRepository = userRepository;
        this.styleProfileRepository = styleProfileRepository;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async register(registerDto) {
        const { email, password, name } = registerDto;
        const existingUser = await this.userRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new common_1.ConflictException('Email already registered');
        }
        const hashedPassword = await bcrypt.hash(password, 12);
        const user = this.userRepository.create({
            email,
            password: hashedPassword,
            name,
            subscriptionTier: user_entity_1.SubscriptionTier.FREE,
        });
        await this.userRepository.save(user);
        const styleProfile = this.styleProfileRepository.create({
            userId: user.id,
        });
        await this.styleProfileRepository.save(styleProfile);
        return this.generateTokens(user);
    }
    async login(loginDto) {
        const { email, password } = loginDto;
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user || !user.password) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.UnauthorizedException('Invalid credentials');
        }
        return this.generateTokens(user);
    }
    async socialAuth(socialAuthDto) {
        const { provider, token, email, name, providerId } = socialAuthDto;
        let user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            user = this.userRepository.create({
                email,
                name,
                emailVerified: true,
                subscriptionTier: user_entity_1.SubscriptionTier.FREE,
                ...(provider === 'google' && { googleId: providerId }),
                ...(provider === 'apple' && { appleId: providerId }),
            });
            await this.userRepository.save(user);
            const styleProfile = this.styleProfileRepository.create({
                userId: user.id,
            });
            await this.styleProfileRepository.save(styleProfile);
        }
        else {
            if (provider === 'google' && !user.googleId) {
                user.googleId = providerId;
                await this.userRepository.save(user);
            }
            else if (provider === 'apple' && !user.appleId) {
                user.appleId = providerId;
                await this.userRepository.save(user);
            }
        }
        return this.generateTokens(user);
    }
    async refreshTokens(refreshToken) {
        try {
            const payload = this.jwtService.verify(refreshToken, {
                secret: this.configService.get('jwt.secret'),
            });
            const user = await this.userRepository.findOne({
                where: { id: payload.sub },
            });
            if (!user || user.refreshToken !== refreshToken) {
                throw new common_1.UnauthorizedException('Invalid refresh token');
            }
            return this.generateTokens(user);
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid refresh token');
        }
    }
    async logout(userId) {
        await this.userRepository.update(userId, { refreshToken: null });
    }
    async forgotPassword(email) {
        const user = await this.userRepository.findOne({ where: { email } });
        if (!user) {
            return { message: 'If your email is registered, you will receive a password reset link' };
        }
        return { message: 'If your email is registered, you will receive a password reset link' };
    }
    async validateUser(userId) {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new common_1.UnauthorizedException('User not found');
        }
        return user;
    }
    async generateTokens(user) {
        const payload = {
            sub: user.id,
            email: user.email,
            tier: user.subscriptionTier,
        };
        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: this.configService.get('jwt.refreshExpiration'),
        });
        user.refreshToken = refreshToken;
        await this.userRepository.save(user);
        return {
            accessToken,
            refreshToken,
            expiresIn: 3600,
        };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(1, (0, typeorm_1.InjectRepository)(style_profile_entity_1.StyleProfile)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map