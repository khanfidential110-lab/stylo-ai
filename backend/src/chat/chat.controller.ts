import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { User } from '../database/entities/user.entity';
import { SendMessageDto } from './dto/send-message.dto';

@ApiTags('chat')
@Controller('chat')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  @ApiOperation({ summary: 'Send a message to AI assistant' })
  @ApiResponse({ status: 200, description: 'Returns AI response' })
  @ApiResponse({ status: 403, description: 'Daily limit reached' })
  async sendMessage(
    @CurrentUser() user: User,
    @Body() sendMessageDto: SendMessageDto,
  ) {
    return this.chatService.sendMessage(
      user.id,
      sendMessageDto,
      user.subscriptionTier,
    );
  }

  @Get('conversations')
  @ApiOperation({ summary: 'Get all conversations' })
  @ApiResponse({ status: 200, description: 'Returns conversations' })
  async getConversations(@CurrentUser() user: User) {
    return this.chatService.getConversations(user.id);
  }

  @Get('conversations/:id')
  @ApiOperation({ summary: 'Get a single conversation' })
  @ApiResponse({ status: 200, description: 'Returns conversation messages' })
  async getConversation(
    @CurrentUser() user: User,
    @Param('id') conversationId: string,
  ) {
    return this.chatService.getConversation(user.id, conversationId);
  }

  @Delete('conversations/:id')
  @ApiOperation({ summary: 'Delete a conversation' })
  @ApiResponse({ status: 200, description: 'Conversation deleted' })
  async deleteConversation(
    @CurrentUser() user: User,
    @Param('id') conversationId: string,
  ) {
    await this.chatService.deleteConversation(user.id, conversationId);
    return { message: 'Conversation deleted' };
  }
}
