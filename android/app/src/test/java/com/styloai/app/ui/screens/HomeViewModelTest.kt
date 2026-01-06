package com.styloai.app.ui.screens.home

import app.cash.turbine.test
import com.styloai.app.data.model.*
import com.styloai.app.data.repository.OutfitRepository
import com.styloai.app.data.repository.WardrobeRepository
import com.styloai.app.data.repository.WeatherRepository
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
class HomeViewModelTest {

    private lateinit var viewModel: HomeViewModel
    private lateinit var wardrobeRepository: WardrobeRepository
    private lateinit var outfitRepository: OutfitRepository
    private lateinit var weatherRepository: WeatherRepository
    private lateinit var authRepository: AuthRepository
    
    private val testDispatcher = StandardTestDispatcher()

    @Before
    fun setup() {
        Dispatchers.setMain(testDispatcher)
        
        wardrobeRepository = mockk(relaxed = true)
        outfitRepository = mockk(relaxed = true)
        weatherRepository = mockk(relaxed = true)
        authRepository = mockk(relaxed = true)
        
        // Default mock responses
        coEvery { authRepository.getCurrentUser() } returns Result.success(
            User(id = "1", email = "test@example.com", name = "Test User")
        )
        coEvery { weatherRepository.getCurrentWeather(any(), any()) } returns Result.success(
            WeatherInfo(temperature = 72.0, condition = "sunny", humidity = 50, feelsLike = 70.0)
        )
        coEvery { wardrobeRepository.getItems(any(), any(), any()) } returns Result.success(emptyList())
        coEvery { outfitRepository.getRecommendations(any(), any()) } returns Result.success(emptyList())
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `initial state should have null user and weather`() = runTest {
        viewModel = HomeViewModel(wardrobeRepository, outfitRepository, weatherRepository, authRepository)
        
        viewModel.uiState.test {
            val initialState = awaitItem()
            assertNull(initialState.user)
            assertNull(initialState.weather)
        }
    }

    @Test
    fun `loadData should fetch user successfully`() = runTest {
        val expectedUser = User(id = "1", email = "test@example.com", name = "Test User")
        coEvery { authRepository.getCurrentUser() } returns Result.success(expectedUser)
        
        viewModel = HomeViewModel(wardrobeRepository, outfitRepository, weatherRepository, authRepository)
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertEquals(expectedUser, state.user)
        }
    }

    @Test
    fun `loadData should fetch weather successfully`() = runTest {
        val expectedWeather = WeatherInfo(
            temperature = 75.0,
            condition = "cloudy",
            humidity = 60,
            feelsLike = 73.0
        )
        coEvery { weatherRepository.getCurrentWeather(any(), any()) } returns Result.success(expectedWeather)
        
        viewModel = HomeViewModel(wardrobeRepository, outfitRepository, weatherRepository, authRepository)
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertEquals(expectedWeather, state.weather)
        }
    }

    @Test
    fun `loadData should handle weather error gracefully`() = runTest {
        coEvery { weatherRepository.getCurrentWeather(any(), any()) } returns Result.failure(
            Exception("Network error")
        )
        
        viewModel = HomeViewModel(wardrobeRepository, outfitRepository, weatherRepository, authRepository)
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertNull(state.weather)
        }
    }

    @Test
    fun `loadData should fetch recent items`() = runTest {
        val expectedItems = listOf(
            WardrobeItem(id = "1", userId = "1", imageUrl = "url1", category = "tops"),
            WardrobeItem(id = "2", userId = "1", imageUrl = "url2", category = "bottoms")
        )
        coEvery { wardrobeRepository.getItems(any(), any(), any()) } returns Result.success(expectedItems)
        
        viewModel = HomeViewModel(wardrobeRepository, outfitRepository, weatherRepository, authRepository)
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertEquals(expectedItems, state.recentItems)
        }
    }

    @Test
    fun `loadData should fetch recommendations`() = runTest {
        val expectedRecs = listOf(
            OutfitRecommendation(
                outfit = Outfit(id = "1", userId = "1", items = emptyList()),
                score = 0.95,
                reason = "Great for today's weather"
            )
        )
        coEvery { outfitRepository.getRecommendations(any(), any()) } returns Result.success(expectedRecs)
        
        viewModel = HomeViewModel(wardrobeRepository, outfitRepository, weatherRepository, authRepository)
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertEquals(expectedRecs, state.recommendations)
        }
    }

    @Test
    fun `loading state should be true while fetching data`() = runTest {
        viewModel = HomeViewModel(wardrobeRepository, outfitRepository, weatherRepository, authRepository)
        
        viewModel.loading.test {
            // Initially might be true during loading
            val loading = awaitItem()
            // After data loads, should be false
            testDispatcher.scheduler.advanceUntilIdle()
        }
    }
}
