package com.styloai.app.data.repository

import com.styloai.app.data.api.StyloApiService
import com.styloai.app.data.model.*
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class ChatRepository @Inject constructor(
    private val api: StyloApiService
) {
    suspend fun getConversations(): Result<List<Conversation>> {
        return try {
            val response = api.getConversations()
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch conversations"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getMessages(conversationId: String): Result<List<ChatMessage>> {
        return try {
            val response = api.getConversationMessages(conversationId)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch messages"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun sendMessage(
        message: String,
        conversationId: String? = null,
        context: ChatContext? = null
    ): Result<ChatResponse> {
        return try {
            val response = api.sendChatMessage(ChatRequest(message, conversationId, context))
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to send message"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun deleteConversation(id: String): Result<Unit> {
        return try {
            val response = api.deleteConversation(id)
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception("Failed to delete conversation"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
