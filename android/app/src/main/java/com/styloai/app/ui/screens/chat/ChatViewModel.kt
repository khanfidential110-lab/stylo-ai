package com.styloai.app.ui.screens.chat

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.styloai.app.data.model.*
import com.styloai.app.data.repository.ChatRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
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
    val isLoading: Boolean = false,
    val conversationId: String? = null,
    val conversations: List<Conversation> = emptyList(),
    val error: String? = null
)

@HiltViewModel
class ChatViewModel @Inject constructor(
    private val repository: ChatRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(ChatUiState())
    val uiState: StateFlow<ChatUiState> = _uiState

    fun updateInputText(text: String) {
        _uiState.value = _uiState.value.copy(inputText = text)
    }

    fun sendMessage() {
        val text = _uiState.value.inputText.trim()
        if (text.isEmpty()) return

        val userMessage = DisplayMessage(
            id = UUID.randomUUID().toString(),
            role = MessageRole.USER,
            content = text
        )

        _uiState.value = _uiState.value.copy(
            messages = _uiState.value.messages + userMessage,
            inputText = "",
            isLoading = true
        )

        viewModelScope.launch {
            val result = repository.sendMessage(
                message = text,
                conversationId = _uiState.value.conversationId
            )

            result.fold(
                onSuccess = { response ->
                    val assistantMessage = DisplayMessage(
                        id = response.message.id,
                        role = MessageRole.ASSISTANT,
                        content = response.message.content,
                        quickActions = response.message.quickActions
                    )

                    _uiState.value = _uiState.value.copy(
                        messages = _uiState.value.messages + assistantMessage,
                        isLoading = false,
                        conversationId = response.conversationId
                    )
                },
                onFailure = { error ->
                    // Add error message as assistant response
                    val errorMessage = DisplayMessage(
                        id = UUID.randomUUID().toString(),
                        role = MessageRole.ASSISTANT,
                        content = "I'm sorry, I encountered an error. Please try again."
                    )

                    _uiState.value = _uiState.value.copy(
                        messages = _uiState.value.messages + errorMessage,
                        isLoading = false,
                        error = error.message
                    )
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

        _uiState.value = _uiState.value.copy(inputText = message)
        sendMessage()
    }

    fun startNewConversation() {
        _uiState.value = ChatUiState()
    }

    fun loadConversations() {
        viewModelScope.launch {
            repository.getConversations().onSuccess { conversations ->
                _uiState.value = _uiState.value.copy(conversations = conversations)
            }
        }
    }

    fun loadConversation(conversationId: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)

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

                    _uiState.value = _uiState.value.copy(
                        messages = displayMessages,
                        isLoading = false,
                        conversationId = conversationId
                    )
                },
                onFailure = {
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = "Failed to load conversation"
                    )
                }
            )
        }
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
}
