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
exports.ChatService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const config_1 = require("@nestjs/config");
const uuid_1 = require("uuid");
const chat_message_entity_1 = require("../database/entities/chat-message.entity");
const ai_chat_service_1 = require("./ai-chat.service");
let ChatService = class ChatService {
    constructor(messageRepository, aiChatService, configService) {
        this.messageRepository = messageRepository;
        this.aiChatService = aiChatService;
        this.configService = configService;
    }
    async sendMessage(userId, sendMessageDto, userTier) {
        const { message, conversationId, attachments } = sendMessageDto;
        await this.checkMessageLimit(userId, userTier);
        const convId = conversationId || (0, uuid_1.v4)();
        const userMessage = this.messageRepository.create({
            userId,
            conversationId: convId,
            role: chat_message_entity_1.MessageRole.USER,
            content: message,
            attachments,
        });
        await this.messageRepository.save(userMessage);
        const history = await this.getConversationHistory(userId, convId);
        const aiResponse = await this.aiChatService.generateResponse(userId, message, history, attachments);
        const assistantMessage = this.messageRepository.create({
            userId,
            conversationId: convId,
            role: chat_message_entity_1.MessageRole.ASSISTANT,
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
    async getConversations(userId) {
        const messages = await this.messageRepository
            .createQueryBuilder('message')
            .where('message.userId = :userId', { userId })
            .orderBy('message.createdAt', 'DESC')
            .getMany();
        const conversationsMap = new Map();
        for (const message of messages) {
            if (!conversationsMap.has(message.conversationId)) {
                conversationsMap.set(message.conversationId, []);
            }
            conversationsMap.get(message.conversationId).push(message);
        }
        const conversations = Array.from(conversationsMap.entries()).map(([id, msgs]) => ({
            id,
            lastMessage: msgs[0].content,
            messageCount: msgs.length,
            createdAt: msgs[msgs.length - 1].createdAt,
            updatedAt: msgs[0].createdAt,
        }));
        return conversations;
    }
    async getConversation(userId, conversationId) {
        const messages = await this.messageRepository.find({
            where: { userId, conversationId },
            order: { createdAt: 'ASC' },
        });
        return {
            id: conversationId,
            messages,
        };
    }
    async deleteConversation(userId, conversationId) {
        await this.messageRepository.delete({ userId, conversationId });
    }
    async getConversationHistory(userId, conversationId) {
        return this.messageRepository.find({
            where: { userId, conversationId },
            order: { createdAt: 'ASC' },
            take: 20,
        });
    }
    async checkMessageLimit(userId, userTier) {
        const limits = this.configService.get('limits');
        const tierLimits = limits[userTier];
        if (tierLimits.dailyChatMessages === -1) {
            return;
        }
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayMessages = await this.messageRepository
            .createQueryBuilder('message')
            .where('message.userId = :userId', { userId })
            .andWhere('message.role = :role', { role: chat_message_entity_1.MessageRole.USER })
            .andWhere('message.createdAt >= :today', { today })
            .getCount();
        if (todayMessages >= tierLimits.dailyChatMessages) {
            throw new common_1.ForbiddenException(`You have reached your daily limit of ${tierLimits.dailyChatMessages} messages. Upgrade to continue.`);
        }
    }
};
exports.ChatService = ChatService;
exports.ChatService = ChatService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(chat_message_entity_1.ChatMessage)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        ai_chat_service_1.AiChatService,
        config_1.ConfigService])
], ChatService);
//# sourceMappingURL=chat.service.js.map