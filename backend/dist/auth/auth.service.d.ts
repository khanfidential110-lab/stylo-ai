import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { User, SubscriptionTier } from '../database/entities/user.entity';
import { StyleProfile } from '../database/entities/style-profile.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SocialAuthDto } from './dto/social-auth.dto';
export interface TokenPayload {
    sub: string;
    email: string;
    tier: SubscriptionTier;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
    expiresIn: number;
}
export declare class AuthService {
    private readonly userRepository;
    private readonly styleProfileRepository;
    private readonly jwtService;
    private readonly configService;
    constructor(userRepository: Repository<User>, styleProfileRepository: Repository<StyleProfile>, jwtService: JwtService, configService: ConfigService);
    register(registerDto: RegisterDto): Promise<AuthTokens>;
    login(loginDto: LoginDto): Promise<AuthTokens>;
    socialAuth(socialAuthDto: SocialAuthDto): Promise<AuthTokens>;
    refreshTokens(refreshToken: string): Promise<AuthTokens>;
    logout(userId: string): Promise<void>;
    forgotPassword(email: string): Promise<{
        message: string;
    }>;
    validateUser(userId: string): Promise<User>;
    private generateTokens;
}
