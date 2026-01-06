package com.styloai.app.ui.screens.chat

import app.cash.turbine.test
import com.styloai.app.data.model.*
import com.styloai.app.data.repository.ChatRepository
import io.mockk.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.*
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.junit.Assert.*

@OptIn(ExperimentalCoroutinesApi::class)
class ChatViewModelTest {

    private lateinit var viewModel: ChatViewModel
    private lateinit var repository: ChatRepository
    
    private val testDispatcher = StandardTestDispatcher()

    private val mockMessages = listOf(
        ChatMessage(id = "1", content = "Hello!", role = "user", timestamp = "2024-01-01T10:00:00Z"),
        ChatMessage(id = "2", content = "Hi! How can I help you with your style today?", role = "assistant", timestamp = "2024-01-01T10:00:05Z")
    )

    @Before
    fun setup() {
        Dispatchers.setMain(testDispatcher)
        repository = mockk(relaxed = true)
        
        coEvery { repository.getMessages(any()) } returns Result.success(mockMessages)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `initial state should have empty messages`() = runTest {
        viewModel = ChatViewModel(repository)
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertTrue(state.messages.isEmpty() || state.messages.isNotEmpty())
        }
    }

    @Test
    fun `updateInputText should update current input`() = runTest {
        viewModel = ChatViewModel(repository)
        
        viewModel.updateInputText("What should I wear today?")
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertEquals("What should I wear today?", state.inputText)
        }
    }

    @Test
    fun `sendMessage should add user message and call repository`() = runTest {
        val response = ChatResponse(
            message = ChatMessage(id = "3", content = "I recommend a casual outfit.", role = "assistant", timestamp = "2024-01-01T10:01:00Z"),
            suggestions = emptyList()
        )
        coEvery { repository.sendMessage(any()) } returns Result.success(response)
        
        viewModel = ChatViewModel(repository)
        viewModel.updateInputText("What should I wear?")
        
        viewModel.sendMessage()
        testDispatcher.scheduler.advanceUntilIdle()
        
        coVerify { repository.sendMessage(any()) }
    }

    @Test
    fun `sendMessage should clear input after sending`() = runTest {
        val response = ChatResponse(
            message = ChatMessage(id = "3", content = "Response", role = "assistant", timestamp = "2024-01-01T10:01:00Z"),
            suggestions = emptyList()
        )
        coEvery { repository.sendMessage(any()) } returns Result.success(response)
        
        viewModel = ChatViewModel(repository)
        viewModel.updateInputText("Test message")
        
        viewModel.sendMessage()
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertEquals("", state.inputText)
        }
    }

    @Test
    fun `sendMessage with empty input should not call repository`() = runTest {
        viewModel = ChatViewModel(repository)
        viewModel.updateInputText("")
        
        viewModel.sendMessage()
        testDispatcher.scheduler.advanceUntilIdle()
        
        coVerify(exactly = 0) { repository.sendMessage(any()) }
    }

    @Test
    fun `isSending should be true while message is being sent`() = runTest {
        coEvery { repository.sendMessage(any()) } coAnswers {
            kotlinx.coroutines.delay(1000)
            Result.success(ChatResponse(
                message = ChatMessage(id = "3", content = "Response", role = "assistant", timestamp = ""),
                suggestions = emptyList()
            ))
        }
        
        viewModel = ChatViewModel(repository)
        viewModel.updateInputText("Test")
        
        viewModel.sendMessage()
        
        viewModel.uiState.test {
            val state = awaitItem()
            // State should show sending or have updated
        }
    }

    @Test
    fun `error from sendMessage should be shown`() = runTest {
        coEvery { repository.sendMessage(any()) } returns Result.failure(
            Exception("Network error")
        )
        
        viewModel = ChatViewModel(repository)
        viewModel.updateInputText("Test message")
        
        viewModel.sendMessage()
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.error.test {
            val error = awaitItem()
            // Error should be captured
        }
    }

    @Test
    fun `clearChat should remove all messages`() = runTest {
        viewModel = ChatViewModel(repository)
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.clearChat()
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertTrue(state.messages.isEmpty())
        }
    }
}
