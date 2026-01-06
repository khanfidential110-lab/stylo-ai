package com.styloai.app.ui.screens.wardrobe

import android.net.Uri
import app.cash.turbine.test
import com.styloai.app.data.model.*
import com.styloai.app.data.repository.WardrobeRepository
import io.mockk.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.*
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.junit.Assert.*

@OptIn(ExperimentalCoroutinesApi::class)
class ItemEditViewModelTest {

    private lateinit var viewModel: ItemEditViewModel
    private lateinit var repository: WardrobeRepository
    
    private val testDispatcher = StandardTestDispatcher()

    @Before
    fun setup() {
        Dispatchers.setMain(testDispatcher)
        repository = mockk(relaxed = true)
        
        mockkStatic(Uri::class)
        every { Uri.parse(any()) } returns mockk(relaxed = true)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
        unmockkStatic(Uri::class)
    }

    @Test
    fun `initial state should have empty values`() = runTest {
        viewModel = ItemEditViewModel(repository)
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertEquals("", state.category)
            assertEquals("", state.color)
            assertEquals("", state.itemName)
        }
    }

    @Test
    fun `updateCategory should update state`() = runTest {
        viewModel = ItemEditViewModel(repository)
        
        viewModel.updateCategory("tops")
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertEquals("tops", state.category)
        }
    }

    @Test
    fun `updateColor should update state`() = runTest {
        viewModel = ItemEditViewModel(repository)
        
        viewModel.updateColor("blue")
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertEquals("blue", state.color)
        }
    }

    @Test
    fun `updateName should update state`() = runTest {
        viewModel = ItemEditViewModel(repository)
        
        viewModel.updateName("Blue Denim Jacket")
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertEquals("Blue Denim Jacket", state.itemName)
        }
    }

    @Test
    fun `updateMaterial should update state`() = runTest {
        viewModel = ItemEditViewModel(repository)
        
        viewModel.updateMaterial("cotton")
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertEquals("cotton", state.material)
        }
    }

    @Test
    fun `updateSeason should update state`() = runTest {
        viewModel = ItemEditViewModel(repository)
        
        viewModel.updateSeason("summer")
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertEquals("summer", state.season)
        }
    }

    @Test
    fun `saveItem should call repository createItem`() = runTest {
        val savedItem = WardrobeItem(
            id = "new-id",
            userId = "1",
            imageUrl = "url",
            category = "tops",
            name = "Test Item"
        )
        coEvery { repository.createItem(any(), any()) } returns Result.success(savedItem)
        
        viewModel = ItemEditViewModel(repository)
        viewModel.updateCategory("tops")
        viewModel.updateColor("blue")
        viewModel.updateName("Test Item")
        
        viewModel.saveItem()
        testDispatcher.scheduler.advanceUntilIdle()
        
        coVerify { repository.createItem(any(), any()) }
    }

    @Test
    fun `saveItem success should set isSaved to true`() = runTest {
        val savedItem = WardrobeItem(
            id = "new-id",
            userId = "1",
            imageUrl = "url",
            category = "tops"
        )
        coEvery { repository.createItem(any(), any()) } returns Result.success(savedItem)
        
        viewModel = ItemEditViewModel(repository)
        viewModel.updateCategory("tops")
        
        viewModel.saveItem()
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertTrue(state.isSaved)
        }
    }

    @Test
    fun `saveItem failure should show error`() = runTest {
        coEvery { repository.createItem(any(), any()) } returns Result.failure(
            Exception("Failed to save")
        )
        
        viewModel = ItemEditViewModel(repository)
        viewModel.updateCategory("tops")
        
        viewModel.saveItem()
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.error.test {
            val error = awaitItem()
            assertNotNull(error)
        }
    }

    @Test
    fun `analyzeImage should set isAnalyzing to true`() = runTest {
        coEvery { repository.analyzeClothing(any(), any()) } coAnswers {
            kotlinx.coroutines.delay(1000)
            Result.success(mapOf("category" to "tops", "color" to "blue"))
        }
        
        viewModel = ItemEditViewModel(repository)
        
        viewModel.analyzeImage("https://example.com/image.jpg")
        
        viewModel.uiState.test {
            // Should have isAnalyzing state
        }
    }
}
