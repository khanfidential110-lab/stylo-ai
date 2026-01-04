import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { ChatMessage, MessageRole } from '../database/entities/chat-message.entity';
import { AiChatService, ChatResponse } from './ai-chat.service';
import { SendMessageDto } from './dto/send-message.dto';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(ChatMessage)
    private readonly messageRepository: Repository<ChatMessage>,
    private readonly aiChatService: AiChatService,
    private readonly configService: ConfigService,
  ) {}

  async sendMessage(
    userId: string,
    sendMessageDto: SendMessageDto,
    userTier: string,
  ): Promise<ChatResponse> {
    const { message, conversationId, attachments } = sendMessageDto;

    // Check daily message limit
    await this.checkMessageLimit(userId, userTier);

    // Get or create conversation ID
    const convId = conversationId || uuidv4();

    // Save user message
    const userMessage = this.messageRepository.create({
      userId,
      conversationId: convId,
      role: MessageRole.USER,
      content: message,
      attachments,
    });
    await this.messageRepository.save(userMessage);

    // Get conversation history for context
    const history = await this.getConversationHistory(userId, convId);

    // Generate AI response
    const aiResponse = await this.aiChatService.generateResponse(
      userId,
      message,
      history,
      attachments,
    );

    // Save AI response
    const assistantMessage = this.messageRepository.create({
      userId,
      conversationId: convId,
      role: MessageRole.ASSISTANT,
      content: aiResponse.message,
      attachments: aiResponse.attachments,
      metadata: aiResponse.metadata,
    });
    await this.messageRepository.save(assistantMessage);

    return {
      ...aiResponse,
      conversationId: convId,
    };
  }

  async getConversations(userId: string) {
    const messages = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.userId = :userId', { userId })
      .orderBy('message.createdAt', 'DESC')
      .getMany();

    // Group by conversation
    const conversationsMap = new Map<string, ChatMessage[]>();
    for (const message of messages) {
      if (!conversationsMap.has(message.conversationId)) {
        conversationsMap.set(message.conversationId, []);
      }
      conversationsMap.get(message.conversationId).push(message);
    }

    // Format conversations
    const conversations = Array.from(conversationsMap.entries()).map(
      ([id, msgs]) => ({
        id,
        lastMessage: msgs[0].content,
        messageCount: msgs.length,
        createdAt: msgs[msgs.length - 1].createdAt,
        updatedAt: msgs[0].createdAt,
      }),
    );

    return conversations;
  }

  async getConversation(userId: string, conversationId: string) {
    const messages = await this.messageRepository.find({
      where: { userId, conversationId },
      order: { createdAt: 'ASC' },
    });

    return {
      id: conversationId,
      messages,
    };
  }

  async deleteConversation(userId: string, conversationId: string) {
    await this.messageRepository.delete({ userId, conversationId });
  }

  private async getConversationHistory(
    userId: string,
    conversationId: string,
  ): Promise<ChatMessage[]> {
    return this.messageRepository.find({
      where: { userId, conversationId },
      order: { createdAt: 'ASC' },
      take: 20, // Limit context to last 20 messages
    });
  }

  private async checkMessageLimit(userId: string, userTier: string): Promise<void> {
    const limits = this.configService.get('limits');
    const tierLimits = limits[userTier];

    if (tierLimits.dailyChatMessages === -1) {
      return; // Unlimited
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayMessages = await this.messageRepository
      .createQueryBuilder('message')
      .where('message.userId = :userId', { userId })
      .andWhere('message.role = :role', { role: MessageRole.USER })
      .andWhere('message.createdAt >= :today', { today })
      .getCount();

    if (todayMessages >= tierLimits.dailyChatMessages) {
      throw new ForbiddenException(
        `You have reached your daily limit of ${tierLimits.dailyChatMessages} messages. Upgrade to continue.`,
      );
    }
  }
}
