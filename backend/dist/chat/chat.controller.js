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
exports.ChatController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const chat_service_1 = require("./chat.service");
const jwt_auth_guard_1 = require("../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../common/decorators/current-user.decorator");
const user_entity_1 = require("../database/entities/user.entity");
const send_message_dto_1 = require("./dto/send-message.dto");
let ChatController = class ChatController {
    constructor(chatService) {
        this.chatService = chatService;
    }
    async sendMessage(user, sendMessageDto) {
        return this.chatService.sendMessage(user.id, sendMessageDto, user.subscriptionTier);
    }
    async getConversations(user) {
        return this.chatService.getConversations(user.id);
    }
    async getConversation(user, conversationId) {
        return this.chatService.getConversation(user.id, conversationId);
    }
    async deleteConversation(user, conversationId) {
        await this.chatService.deleteConversation(user.id, conversationId);
        return { message: 'Conversation deleted' };
    }
};
exports.ChatController = ChatController;
__decorate([
    (0, common_1.Post)(),
    (0, swagger_1.ApiOperation)({ summary: 'Send a message to AI assistant' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns AI response' }),
    (0, swagger_1.ApiResponse)({ status: 403, description: 'Daily limit reached' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User,
        send_message_dto_1.SendMessageDto]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "sendMessage", null);
__decorate([
    (0, common_1.Get)('conversations'),
    (0, swagger_1.ApiOperation)({ summary: 'Get all conversations' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns conversations' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getConversations", null);
__decorate([
    (0, common_1.Get)('conversations/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get a single conversation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Returns conversation messages' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "getConversation", null);
__decorate([
    (0, common_1.Delete)('conversations/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Delete a conversation' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Conversation deleted' }),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.User, String]),
    __metadata("design:returntype", Promise)
], ChatController.prototype, "deleteConversation", null);
exports.ChatController = ChatController = __decorate([
    (0, swagger_1.ApiTags)('chat'),
    (0, common_1.Controller)('chat'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [chat_service_1.ChatService])
], ChatController);
//# sourceMappingURL=chat.controller.js.map