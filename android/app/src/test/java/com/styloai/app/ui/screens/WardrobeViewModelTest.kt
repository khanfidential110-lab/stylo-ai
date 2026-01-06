package com.styloai.app.ui.screens.wardrobe

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
class WardrobeViewModelTest {

    private lateinit var viewModel: WardrobeViewModel
    private lateinit var repository: WardrobeRepository
    
    private val testDispatcher = StandardTestDispatcher()

    private val mockItems = listOf(
        WardrobeItem(id = "1", userId = "1", imageUrl = "url1", category = "tops", name = "Blue Shirt"),
        WardrobeItem(id = "2", userId = "1", imageUrl = "url2", category = "bottoms", name = "Black Jeans"),
        WardrobeItem(id = "3", userId = "1", imageUrl = "url3", category = "tops", name = "White Tee")
    )

    @Before
    fun setup() {
        Dispatchers.setMain(testDispatcher)
        repository = mockk(relaxed = true)
        
        coEvery { repository.getItems(any(), any(), any()) } returns Result.success(mockItems)
        coEvery { repository.getStats() } returns Result.success(
            WardrobeStats(totalItems = 3, byCategory = mapOf("tops" to 2, "bottoms" to 1), byColor = emptyMap(), mostWorn = emptyList(), leastWorn = emptyList(), favorites = emptyList())
        )
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `initial load should fetch all items`() = runTest {
        viewModel = WardrobeViewModel(repository)
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertEquals(3, state.items.size)
        }
        
        coVerify { repository.getItems(null, null, null) }
    }

    @Test
    fun `selectCategory should filter items`() = runTest {
        val filteredItems = mockItems.filter { it.category == "tops" }
        coEvery { repository.getItems("tops", any(), any()) } returns Result.success(filteredItems)
        
        viewModel = WardrobeViewModel(repository)
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.selectCategory("tops")
        testDispatcher.scheduler.advanceUntilIdle()
        
        coVerify { repository.getItems("tops", null, null) }
    }

    @Test
    fun `updateSearchQuery should update state`() = runTest {
        viewModel = WardrobeViewModel(repository)
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.updateSearchQuery("blue")
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertEquals("blue", state.searchQuery)
        }
    }

    @Test
    fun `toggleFavorite should call repository`() = runTest {
        val item = mockItems[0]
        val updatedItem = item.copy(isFavorite = true)
        coEvery { repository.toggleFavorite(item.id, true) } returns Result.success(updatedItem)
        
        viewModel = WardrobeViewModel(repository)
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.toggleFavorite(item)
        testDispatcher.scheduler.advanceUntilIdle()
        
        coVerify { repository.toggleFavorite(item.id, true) }
    }

    @Test
    fun `deleteItem should remove item from list`() = runTest {
        coEvery { repository.deleteItem(any()) } returns Result.success(Unit)
        
        viewModel = WardrobeViewModel(repository)
        testDispatcher.scheduler.advanceUntilIdle()
        
        val itemToDelete = mockItems[0]
        viewModel.deleteItem(itemToDelete)
        testDispatcher.scheduler.advanceUntilIdle()
        
        coVerify { repository.deleteItem(itemToDelete.id) }
    }

    @Test
    fun `showAddItem should set showAddItem to true`() = runTest {
        viewModel = WardrobeViewModel(repository)
        
        viewModel.showAddItem()
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertTrue(state.showAddItem)
        }
    }

    @Test
    fun `hideAddItem should set showAddItem to false`() = runTest {
        viewModel = WardrobeViewModel(repository)
        viewModel.showAddItem()
        
        viewModel.hideAddItem()
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertFalse(state.showAddItem)
        }
    }

    @Test
    fun `error from repository should be shown`() = runTest {
        coEvery { repository.getItems(any(), any(), any()) } returns Result.failure(
            Exception("Network error")
        )
        
        viewModel = WardrobeViewModel(repository)
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.error.test {
            val error = awaitItem()
            assertNotNull(error)
            assertTrue(error?.contains("error") == true || error?.contains("Error") == true || error?.contains("Network") == true)
        }
    }
}
