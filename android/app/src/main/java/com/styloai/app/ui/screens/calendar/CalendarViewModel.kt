package com.styloai.app.ui.screens.calendar

import androidx.lifecycle.viewModelScope
import com.styloai.app.data.model.OutfitCalendarEntry
import com.styloai.app.data.repository.CalendarRepository
import com.styloai.app.ui.base.BaseViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import java.time.LocalDate
import java.time.YearMonth
import javax.inject.Inject

data class CalendarUiState(
    val entries: List<OutfitCalendarEntry> = emptyList(),
    val selectedDate: LocalDate = LocalDate.now(),
    val currentMonth: YearMonth = YearMonth.now(),
    val selectedEntry: OutfitCalendarEntry? = null
)

@HiltViewModel
class CalendarViewModel @Inject constructor(
    private val repository: CalendarRepository
) : BaseViewModel<CalendarUiState>(CalendarUiState()) {

    init {
        loadEntries()
    }

    fun loadEntries() {
        viewModelScope.launch {
            setLoading(true)
            val month = uiState.value.currentMonth
            val startDate = month.atDay(1).toString()
            val endDate = month.atEndOfMonth().toString()
            
            repository.getCalendarEntries(startDate, endDate).fold(
                onSuccess = { entries ->
                    setLoading(false)
                    val selectedEntry = entries.find { it.date == uiState.value.selectedDate.toString() }
                    updateState { it.copy(entries = entries, selectedEntry = selectedEntry) }
                },
                onFailure = { error ->
                    setLoading(false)
                    showError(error.message ?: "Failed to load calendar")
                }
            )
        }
    }

    fun selectDate(date: LocalDate) {
        updateState { state ->
            val entry = state.entries.find { it.date == date.toString() }
            state.copy(selectedDate = date, selectedEntry = entry)
        }
    }

    fun nextMonth() {
        updateState { it.copy(currentMonth = it.currentMonth.plusMonths(1)) }
        loadEntries()
    }

    fun prevMonth() {
        updateState { it.copy(currentMonth = it.currentMonth.minusMonths(1)) }
        loadEntries()
    }

    fun confirmWorn(outfitId: String) {
        viewModelScope.launch {
            setLoading(true)
            repository.markOutfitWorn(outfitId).fold(
                onSuccess = {
                    setLoading(false)
                    loadEntries() // Refresh to show updated status
                },
                onFailure = { error ->
                    setLoading(false)
                    showError(error.message ?: "Failed to confirm outfit")
                }
            )
        }
    }

    fun onDateSelected(date: LocalDate) {
        selectDate(date)
    }

    fun onMonthChanged(isNext: Boolean) {
        if (isNext) nextMonth() else prevMonth()
    }
}
