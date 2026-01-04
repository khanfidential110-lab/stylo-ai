package com.styloai.app.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable
import java.util.UUID

@Serializable
enum class MessageRole {
    @SerialName("user") USER,
    @SerialName("assistant") ASSISTANT,
    @SerialName("system") SYSTEM
}

@Serializable
data class ChatMessage(
    val id: String = UUID.randomUUID().toString(),
    val role: MessageRole,
    val content: String,
    val timestamp: Long = System.currentTimeMillis(),
    @SerialName("quick_actions") val quickActions: List<QuickAction>? = null
)

@Serializable
data class QuickAction(
    val label: String,
    val action: String
)

@Serializable
data class Conversation(
    val id: String,
    @SerialName("user_id") val userId: String,
    val title: String? = null,
    @SerialName("last_message") val lastMessage: String? = null,
    @SerialName("message_count") val messageCount: Int = 0,
    @SerialName("created_at") val createdAt: String,
    @SerialName("updated_at") val updatedAt: String
)

@Serializable
data class ChatRequest(
    val message: String,
    @SerialName("conversation_id") val conversationId: String? = null,
    val context: ChatContext? = null
)

@Serializable
data class ChatContext(
    @SerialName("wardrobe_items") val wardrobeItems: List<String>? = null,
    @SerialName("current_weather") val currentWeather: WeatherInfo? = null,
    val occasion: String? = null
)

@Serializable
data class ChatResponse(
    val message: ChatMessage,
    @SerialName("conversation_id") val conversationId: String,
    @SerialName("outfit_suggestions") val outfitSuggestions: List<Outfit>? = null
)

data class DisplayMessage(
    val id: String = UUID.randomUUID().toString(),
    val role: MessageRole,
    val content: String,
    val timestamp: Long = System.currentTimeMillis(),
    val quickActions: List<QuickAction>? = null,
    val isLoading: Boolean = false
)
