package com.styloai.app.ui.screens.chat

import androidx.lifecycle.viewModelScope
import com.styloai.app.data.model.*
import com.styloai.app.data.repository.ChatRepository
import com.styloai.app.ui.base.BaseViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import java.util.UUID
import javax.inject.Inject

data class ChatUiState(
    val messages: List<DisplayMessage> = listOf(
        DisplayMessage(
            id = "welcome",
            role = MessageRole.ASSISTANT,
            content = "Hi! I'm your AI style assistant. Ask me anything about fashion, outfit ideas, or get personalized recommendations based on your wardrobe!",
            quickActions = listOf(
                QuickAction("Outfit for today", "suggest_outfit_today"),
                QuickAction("Style tips", "style_tips"),
                QuickAction("Color matching", "color_help")
            )
        )
    ),
    val inputText: String = "",
    val conversationId: String? = null,
    val conversations: List<Conversation> = emptyList()
)

@HiltViewModel
class ChatViewModel @Inject constructor(
    private val repository: ChatRepository
) : BaseViewModel<ChatUiState>(ChatUiState()) {

    fun updateInputText(text: String) {
        updateState { it.copy(inputText = text) }
    }

    fun sendMessage() {
        val text = uiState.value.inputText.trim()
        if (text.isEmpty()) return

        val userMessage = DisplayMessage(
            id = UUID.randomUUID().toString(),
            role = MessageRole.USER,
            content = text
        )

        updateState { 
            it.copy(
                messages = it.messages + userMessage,
                inputText = ""
            )
        }

        viewModelScope.launch {
            setLoading(true)
            val result = repository.sendMessage(
                message = text,
                conversationId = uiState.value.conversationId
            )

            result.fold(
                onSuccess = { response ->
                    val assistantMessage = DisplayMessage(
                        id = response.message.id,
                        role = MessageRole.ASSISTANT,
                        content = response.message.content,
                        quickActions = response.message.quickActions
                    )

                    updateState { 
                        it.copy(
                            messages = it.messages + assistantMessage,
                            conversationId = response.conversationId
                        )
                    }
                    setLoading(false)
                },
                onFailure = { error ->
                    val errorMessage = DisplayMessage(
                        id = UUID.randomUUID().toString(),
                        role = MessageRole.ASSISTANT,
                        content = "I'm sorry, I encountered an error. Please try again."
                    )

                    updateState { it.copy(messages = it.messages + errorMessage) }
                    setLoading(false)
                    showError(error.message ?: "Failed to send message")
                }
            )
        }
    }

    fun handleQuickAction(action: String) {
        val message = when (action) {
            "suggest_outfit_today" -> "Suggest an outfit for today based on the weather"
            "style_tips" -> "Give me some style tips for my body type"
            "color_help" -> "Help me understand color matching in outfits"
            else -> action
        }

        updateInputText(message)
        sendMessage()
    }

    fun startNewConversation() {
        updateState { ChatUiState() }
    }

    fun loadConversations() {
        viewModelScope.launch {
            repository.getConversations().onSuccess { conversations ->
                updateState { it.copy(conversations = conversations) }
            }.onFailure { error ->
                showError(error.message ?: "Failed to load conversations")
            }
        }
    }

    fun loadConversation(conversationId: String) {
        viewModelScope.launch {
            setLoading(true)

            repository.getMessages(conversationId).fold(
                onSuccess = { messages ->
                    val displayMessages = messages.map { msg ->
                        DisplayMessage(
                            id = msg.id,
                            role = msg.role,
                            content = msg.content,
                            timestamp = msg.timestamp,
                            quickActions = msg.quickActions
                        )
                    }

                    updateState { 
                        it.copy(
                            messages = displayMessages,
                            conversationId = conversationId
                        )
                    }
                    setLoading(false)
                },
                onFailure = { error ->
                    setLoading(false)
                    showError(error.message ?: "Failed to load conversation")
                }
            )
        }
    }
}
