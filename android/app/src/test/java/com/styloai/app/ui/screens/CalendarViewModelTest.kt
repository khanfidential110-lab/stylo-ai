package com.styloai.app.ui.screens.calendar

import app.cash.turbine.test
import com.styloai.app.data.model.*
import com.styloai.app.data.repository.CalendarRepository
import io.mockk.*
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.ExperimentalCoroutinesApi
import kotlinx.coroutines.test.*
import org.junit.After
import org.junit.Before
import org.junit.Test
import org.junit.Assert.*
import java.time.LocalDate
import java.time.YearMonth

@OptIn(ExperimentalCoroutinesApi::class)
class CalendarViewModelTest {

    private lateinit var viewModel: CalendarViewModel
    private lateinit var repository: CalendarRepository
    
    private val testDispatcher = StandardTestDispatcher()

    private val mockEntries = listOf(
        OutfitCalendarEntry(
            id = "1",
            date = LocalDate.now().toString(),
            outfitId = "outfit1",
            outfit = Outfit(id = "outfit1", userId = "1", items = emptyList()),
            occasion = "work",
            wasWorn = false
        )
    )

    @Before
    fun setup() {
        Dispatchers.setMain(testDispatcher)
        repository = mockk(relaxed = true)
        
        coEvery { repository.getCalendarEntries(any(), any()) } returns Result.success(mockEntries)
    }

    @After
    fun tearDown() {
        Dispatchers.resetMain()
    }

    @Test
    fun `initial state should have current month and today selected`() = runTest {
        viewModel = CalendarViewModel(repository)
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertEquals(YearMonth.now(), state.currentMonth)
            assertEquals(LocalDate.now(), state.selectedDate)
        }
    }

    @Test
    fun `loadEntries should fetch calendar entries`() = runTest {
        viewModel = CalendarViewModel(repository)
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertEquals(1, state.entries.size)
        }
        
        coVerify { repository.getCalendarEntries(any(), any()) }
    }

    @Test
    fun `onDateSelected should update selected date`() = runTest {
        viewModel = CalendarViewModel(repository)
        testDispatcher.scheduler.advanceUntilIdle()
        
        val newDate = LocalDate.now().plusDays(5)
        viewModel.onDateSelected(newDate)
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertEquals(newDate, state.selectedDate)
        }
    }

    @Test
    fun `onMonthChanged with true should go to next month`() = runTest {
        viewModel = CalendarViewModel(repository)
        testDispatcher.scheduler.advanceUntilIdle()
        
        val currentMonth = YearMonth.now()
        viewModel.onMonthChanged(true)
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertEquals(currentMonth.plusMonths(1), state.currentMonth)
        }
    }

    @Test
    fun `onMonthChanged with false should go to previous month`() = runTest {
        viewModel = CalendarViewModel(repository)
        testDispatcher.scheduler.advanceUntilIdle()
        
        val currentMonth = YearMonth.now()
        viewModel.onMonthChanged(false)
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.uiState.test {
            val state = awaitItem()
            assertEquals(currentMonth.minusMonths(1), state.currentMonth)
        }
    }

    @Test
    fun `confirmWorn should call repository markOutfitWorn`() = runTest {
        coEvery { repository.markOutfitWorn(any()) } returns Result.success(Unit)
        
        viewModel = CalendarViewModel(repository)
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.confirmWorn("outfit1")
        testDispatcher.scheduler.advanceUntilIdle()
        
        coVerify { repository.markOutfitWorn("outfit1") }
    }

    @Test
    fun `error from repository should be shown`() = runTest {
        coEvery { repository.getCalendarEntries(any(), any()) } returns Result.failure(
            Exception("Failed to load calendar")
        )
        
        viewModel = CalendarViewModel(repository)
        testDispatcher.scheduler.advanceUntilIdle()
        
        viewModel.error.test {
            val error = awaitItem()
            assertNotNull(error)
        }
    }
}
