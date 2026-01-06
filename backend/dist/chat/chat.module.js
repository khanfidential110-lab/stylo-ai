"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const chat_controller_1 = require("./chat.controller");
const chat_service_1 = require("./chat.service");
const ai_chat_service_1 = require("./ai-chat.service");
const llm_service_1 = require("./llm.service");
const chat_message_entity_1 = require("../database/entities/chat-message.entity");
const wardrobe_module_1 = require("../wardrobe/wardrobe.module");
const weather_module_1 = require("../weather/weather.module");
const gemini_service_1 = require("../common/services/gemini.service");
let ChatModule = class ChatModule {
};
exports.ChatModule = ChatModule;
exports.ChatModule = ChatModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([chat_message_entity_1.ChatMessage]),
            wardrobe_module_1.WardrobeModule,
            weather_module_1.WeatherModule,
        ],
        controllers: [chat_controller_1.ChatController],
        providers: [chat_service_1.ChatService, ai_chat_service_1.AiChatService, llm_service_1.LLMService, gemini_service_1.GeminiService],
        exports: [chat_service_1.ChatService, llm_service_1.LLMService, gemini_service_1.GeminiService],
    })
], ChatModule);
//# sourceMappingURL=chat.module.js.map