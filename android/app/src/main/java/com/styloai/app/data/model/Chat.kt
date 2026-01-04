package com.styloai.app.data.model

import com.google.gson.annotations.SerializedName
import java.util.UUID

enum class MessageRole {
    @SerializedName("user") USER,
    @SerializedName("assistant") ASSISTANT,
    @SerializedName("system") SYSTEM
}

data class ChatMessage(
    val id: String = UUID.randomUUID().toString(),
    val role: MessageRole,
    val content: String,
    val timestamp: Long = System.currentTimeMillis(),
    @SerializedName("quick_actions") val quickActions: List<QuickAction>? = null
)

data class QuickAction(
    val label: String,
    val action: String
)

data class Conversation(
    val id: String,
    @SerializedName("user_id") val userId: String,
    val title: String? = null,
    @SerializedName("last_message") val lastMessage: String? = null,
    @SerializedName("message_count") val messageCount: Int = 0,
    @SerializedName("created_at") val createdAt: String,
    @SerializedName("updated_at") val updatedAt: String
)

data class ChatRequest(
    val message: String,
    @SerializedName("conversation_id") val conversationId: String? = null,
    val context: ChatContext? = null
)

data class ChatContext(
    @SerializedName("wardrobe_items") val wardrobeItems: List<String>? = null,
    @SerializedName("current_weather") val currentWeather: WeatherInfo? = null,
    val occasion: String? = null
)

data class ChatResponse(
    val message: ChatMessage,
    @SerializedName("conversation_id") val conversationId: String,
    @SerializedName("outfit_suggestions") val outfitSuggestions: List<Outfit>? = null
)

data class DisplayMessage(
    val id: String = UUID.randomUUID().toString(),
    val role: MessageRole,
    val content: String,
    val timestamp: Long = System.currentTimeMillis(),
    val quickActions: List<QuickAction>? = null,
    val isLoading: Boolean = false
)
