import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { SocialAuthDto } from './dto/social-auth.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { User } from '../database/entities/user.entity';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<import("./auth.service").AuthTokens>;
    login(loginDto: LoginDto): Promise<import("./auth.service").AuthTokens>;
    socialAuth(socialAuthDto: SocialAuthDto): Promise<import("./auth.service").AuthTokens>;
    refreshTokens(refreshTokenDto: RefreshTokenDto): Promise<import("./auth.service").AuthTokens>;
    logout(user: User): Promise<{
        message: string;
    }>;
    forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{
        message: string;
    }>;
}
