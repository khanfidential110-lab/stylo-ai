import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AiChatService } from './ai-chat.service';
import { LLMService } from './llm.service';
import { ChatMessage } from '../database/entities/chat-message.entity';
import { WardrobeModule } from '../wardrobe/wardrobe.module';
import { WeatherModule } from '../weather/weather.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ChatMessage]),
    WardrobeModule,
    WeatherModule,
  ],
  controllers: [ChatController],
  providers: [ChatService, AiChatService, LLMService],
  exports: [ChatService, LLMService],
})
export class ChatModule {}
