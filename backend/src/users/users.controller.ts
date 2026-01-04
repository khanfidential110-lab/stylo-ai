import {
  Controller,
  Get,
  Patch,
  Put,
  Post,
  Delete,
  Body,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../database/entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateStyleProfileDto } from './dto/update-style-profile.dto';

@ApiTags('users')
@Controller('users')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Returns user profile' })
  async getProfile(@CurrentUser() user: User) {
    return this.usersService.findById(user.id);
  }

  @Patch('me')
  @ApiOperation({ summary: 'Update current user profile' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  async updateProfile(
    @CurrentUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.updateUser(user.id, updateUserDto);
  }

  @Post('me/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Upload user avatar' })
  @ApiResponse({ status: 200, description: 'Avatar uploaded' })
  async uploadAvatar(
    @CurrentUser() user: User,
    @UploadedFile() file: Express.Multer.File,
  ) {
    // In production, upload to S3 and get URL
    const avatarUrl = `https://cdn.stylo-ai.com/avatars/${user.id}/${file.filename}`;
    return this.usersService.updateAvatar(user.id, avatarUrl);
  }

  @Delete('me')
  @ApiOperation({ summary: 'Delete current user account' })
  @ApiResponse({ status: 200, description: 'Account deleted' })
  async deleteAccount(@CurrentUser() user: User) {
    await this.usersService.deleteUser(user.id);
    return { message: 'Account deleted successfully' };
  }

  @Get('me/style-profile')
  @ApiOperation({ summary: 'Get user style profile' })
  @ApiResponse({ status: 200, description: 'Returns style profile' })
  async getStyleProfile(@CurrentUser() user: User) {
    return this.usersService.getStyleProfile(user.id);
  }

  @Put('me/style-profile')
  @ApiOperation({ summary: 'Update user style profile' })
  @ApiResponse({ status: 200, description: 'Style profile updated' })
  async updateStyleProfile(
    @CurrentUser() user: User,
    @Body() updateDto: UpdateStyleProfileDto,
  ) {
    return this.usersService.updateStyleProfile(user.id, updateDto);
  }

  @Get('me/stats')
  @ApiOperation({ summary: 'Get user statistics' })
  @ApiResponse({ status: 200, description: 'Returns user stats' })
  async getUserStats(@CurrentUser() user: User) {
    return this.usersService.getUserStats(user.id);
  }
}
