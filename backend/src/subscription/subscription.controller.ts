import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Headers,
  RawBodyRequest,
  Req,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Request } from 'express';
import { SubscriptionService } from './subscription.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { Public } from '../common/decorators/public.decorator';
import { User } from '../database/entities/user.entity';
import { VerifyApplePurchaseDto } from './dto/verify-apple-purchase.dto';
import { VerifyGooglePurchaseDto } from './dto/verify-google-purchase.dto';
import { RestorePurchasesDto } from './dto/restore-purchases.dto';

@ApiTags('subscription')
@Controller('subscription')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get available subscription plans' })
  @ApiResponse({ status: 200, description: 'Returns subscription plans' })
  async getPlans() {
    return this.subscriptionService.getPlans();
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get current subscription status' })
  @ApiResponse({ status: 200, description: 'Returns subscription info' })
  async getSubscription(@CurrentUser() user: User) {
    return this.subscriptionService.getSubscription(user.id);
  }

  @Post('verify/apple')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify Apple App Store purchase' })
  @ApiResponse({ status: 200, description: 'Purchase verified' })
  async verifyApplePurchase(
    @CurrentUser() user: User,
    @Body() dto: VerifyApplePurchaseDto,
  ) {
    return this.subscriptionService.verifyApplePurchase(user.id, dto.receiptData);
  }

  @Post('verify/google')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Verify Google Play purchase' })
  @ApiResponse({ status: 200, description: 'Purchase verified' })
  async verifyGooglePurchase(
    @CurrentUser() user: User,
    @Body() dto: VerifyGooglePurchaseDto,
  ) {
    return this.subscriptionService.verifyGooglePurchase(
      user.id,
      dto.purchaseToken,
      dto.productId,
    );
  }

  @Post('restore')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Restore purchases' })
  @ApiResponse({ status: 200, description: 'Purchases restored' })
  async restorePurchases(
    @CurrentUser() user: User,
    @Body() dto: RestorePurchasesDto,
  ) {
    return this.subscriptionService.restorePurchases(
      user.id,
      dto.platform,
      dto.receipts,
    );
  }

  @Post('cancel')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cancel subscription' })
  @ApiResponse({ status: 200, description: 'Subscription cancelled' })
  async cancelSubscription(@CurrentUser() user: User) {
    return this.subscriptionService.cancelSubscription(user.id);
  }

  @Post('trial')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Start free trial' })
  @ApiResponse({ status: 201, description: 'Trial started' })
  async startTrial(@CurrentUser() user: User) {
    return this.subscriptionService.startTrial(user.id);
  }

  @Post('webhook/apple')
  @Public()
  @ApiOperation({ summary: 'Apple App Store Server Notifications webhook' })
  async handleAppleWebhook(@Body() body: { signedPayload: string }) {
    return this.subscriptionService.handleAppleWebhook(body.signedPayload);
  }

  @Post('webhook/google')
  @Public()
  @ApiOperation({ summary: 'Google Play Real-time Developer Notifications webhook' })
  async handleGoogleWebhook(@Body() body: { message: any }) {
    return this.subscriptionService.handleGoogleWebhook(body.message);
  }
}
