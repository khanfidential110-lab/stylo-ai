package com.styloai.app.ui.screens.profile

import app.cash.turbine.test
import com.styloai.app.data.model.*
import com.styloai.app.data.repository.AuthRepository
import io.mockk.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.*
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.junit.Assert.*

@OptIn(ExperimentalCoroutinesApi::class)
class ProfileViewModelTest {

    private lateinit var viewModel: ProfileViewModel
    private lateinit var authRepository: AuthRepository
    
    private val testDispatcher = StandardTestDispatcher()

    private val mockUser = User(
        id = "1",
        email = "test@example.com",
        name = "Test User",
        avatarUrl = "https://example.com/avatar.jpg"
    )

    @Before
    fun setup() {
        Dispatchers.setMain(testDispatcher)
        authRepository = mockk(relaxed = true)
        
        coEvery { authRepository.getCurrentUser() } returns Result.success(mockUser)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `initial load should fetch current user`() = runTest {
        viewModel = ProfileViewModel(authRepository)
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertEquals(mockUser, state.user)
        }
        
        coVerify { authRepository.getCurrentUser() }
    }

    @Test
    fun `user email should be displayed correctly`() = runTest {
        viewModel = ProfileViewModel(authRepository)
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertEquals("test@example.com", state.user?.email)
        }
    }

    @Test
    fun `user name should be displayed correctly`() = runTest {
        viewModel = ProfileViewModel(authRepository)
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertEquals("Test User", state.user?.name)
        }
    }

    @Test
    fun `logout should call authRepository logout`() = runTest {
        coEvery { authRepository.logout() } returns Result.success(Unit)
        
        viewModel = ProfileViewModel(authRepository)
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.logout()
        testDispatcher.scheduler.advanceUntilIdle()
        
        coVerify { authRepository.logout() }
    }

    @Test
    fun `logout should set loggedOut state to true`() = runTest {
        coEvery { authRepository.logout() } returns Result.success(Unit)
        
        viewModel = ProfileViewModel(authRepository)
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.logout()
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertTrue(state.isLoggedOut)
        }
    }

    @Test
    fun `error fetching user should be handled gracefully`() = runTest {
        coEvery { authRepository.getCurrentUser() } returns Result.failure(
            Exception("Not authenticated")
        )
        
        viewModel = ProfileViewModel(authRepository)
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertNull(state.user)
        }
    }

    @Test
    fun `updateProfile should call repository`() = runTest {
        val updatedUser = mockUser.copy(name = "New Name")
        coEvery { authRepository.updateProfile(any()) } returns Result.success(updatedUser)
        
        viewModel = ProfileViewModel(authRepository)
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.updateProfile(mapOf("name" to "New Name"))
        testDispatcher.scheduler.advanceUntilIdle()
        
        coVerify { authRepository.updateProfile(any()) }
    }
}
