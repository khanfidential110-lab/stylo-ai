import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
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

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(StyleProfile)
    private readonly styleProfileRepository: Repository<StyleProfile>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthTokens> {
    const { email, password, name } = registerDto;

    // Check if user exists
    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      name,
      subscriptionTier: SubscriptionTier.FREE,
    });
    await this.userRepository.save(user);

    // Create default style profile
    const styleProfile = this.styleProfileRepository.create({
      userId: user.id,
    });
    await this.styleProfileRepository.save(styleProfile);

    // Generate tokens
    return this.generateTokens(user);
  }

  async login(loginDto: LoginDto): Promise<AuthTokens> {
    const { email, password } = loginDto;

    const user = await this.userRepository.findOne({ where: { email } });
    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return this.generateTokens(user);
  }

  async socialAuth(socialAuthDto: SocialAuthDto): Promise<AuthTokens> {
    const { provider, token, email, name, providerId } = socialAuthDto;

    let user = await this.userRepository.findOne({ where: { email } });

    if (!user) {
      // Create new user
      user = this.userRepository.create({
        email,
        name,
        emailVerified: true,
        subscriptionTier: SubscriptionTier.FREE,
        ...(provider === 'google' && { googleId: providerId }),
        ...(provider === 'apple' && { appleId: providerId }),
      });
      await this.userRepository.save(user);

      // Create default style profile
      const styleProfile = this.styleProfileRepository.create({
        userId: user.id,
      });
      await this.styleProfileRepository.save(styleProfile);
    } else {
      // Update provider ID if not set
      if (provider === 'google' && !user.googleId) {
        user.googleId = providerId;
        await this.userRepository.save(user);
      } else if (provider === 'apple' && !user.appleId) {
        user.appleId = providerId;
        await this.userRepository.save(user);
      }
    }

    return this.generateTokens(user);
  }

  async refreshTokens(refreshToken: string): Promise<AuthTokens> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get('jwt.secret'),
      });

      const user = await this.userRepository.findOne({
        where: { id: payload.sub },
      });

      if (!user || user.refreshToken !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.generateTokens(user);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.update(userId, { refreshToken: null });
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      // Don't reveal if email exists
      return { message: 'If your email is registered, you will receive a password reset link' };
    }

    // In production, send email with reset token
    // For now, just return success message
    return { message: 'If your email is registered, you will receive a password reset link' };
  }

  async validateUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  private async generateTokens(user: User): Promise<AuthTokens> {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      tier: user.subscriptionTier,
    };

    const accessToken = this.jwtService.sign(payload);
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get('jwt.refreshExpiration'),
    });

    // Save refresh token
    user.refreshToken = refreshToken;
    await this.userRepository.save(user);

    return {
      accessToken,
      refreshToken,
      expiresIn: 3600, // 1 hour in seconds
    };
  }
}
