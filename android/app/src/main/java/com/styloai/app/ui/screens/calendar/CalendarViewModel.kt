package com.styloai.app.ui.screens.calendar

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.styloai.app.data.model.*
import com.styloai.app.data.repository.OutfitRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*
import javax.inject.Inject

data class CalendarUiState(
    val isLoading: Boolean = true,
    val currentMonth: Calendar = Calendar.getInstance(),
    val selectedDate: Calendar? = null,
    val calendarEntries: Map<String, OutfitCalendarEntry> = emptyMap(),
    val selectedDayEntry: OutfitCalendarEntry? = null,
    val outfits: List<Outfit> = emptyList(),
    val showPlanOutfitSheet: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class CalendarViewModel @Inject constructor(
    private val outfitRepository: OutfitRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(CalendarUiState())
    val uiState: StateFlow<CalendarUiState> = _uiState

    private val dateFormat = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())

    init {
        loadCalendarData()
        loadOutfits()
    }

    fun loadCalendarData() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)

            val calendar = _uiState.value.currentMonth
            val startDate = getMonthStartDate(calendar)
            val endDate = getMonthEndDate(calendar)

            outfitRepository.getCalendarEntries(startDate, endDate).fold(
                onSuccess = { entries ->
                    val entriesMap = entries.associateBy { it.date }
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        calendarEntries = entriesMap
                    )
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = error.message
                    )
                }
            )
        }
    }

    private fun loadOutfits() {
        viewModelScope.launch {
            outfitRepository.getOutfits().onSuccess { outfits ->
                _uiState.value = _uiState.value.copy(outfits = outfits)
            }
        }
    }

    fun selectDate(date: Calendar) {
        val dateStr = dateFormat.format(date.time)
        val entry = _uiState.value.calendarEntries[dateStr]
        _uiState.value = _uiState.value.copy(
            selectedDate = date,
            selectedDayEntry = entry
        )
    }

    fun previousMonth() {
        val newMonth = (_uiState.value.currentMonth.clone() as Calendar).apply {
            add(Calendar.MONTH, -1)
        }
        _uiState.value = _uiState.value.copy(
            currentMonth = newMonth,
            selectedDate = null,
            selectedDayEntry = null
        )
        loadCalendarData()
    }

    fun nextMonth() {
        val newMonth = (_uiState.value.currentMonth.clone() as Calendar).apply {
            add(Calendar.MONTH, 1)
        }
        _uiState.value = _uiState.value.copy(
            currentMonth = newMonth,
            selectedDate = null,
            selectedDayEntry = null
        )
        loadCalendarData()
    }

    fun showPlanOutfit() {
        _uiState.value = _uiState.value.copy(showPlanOutfitSheet = true)
    }

    fun hidePlanOutfit() {
        _uiState.value = _uiState.value.copy(showPlanOutfitSheet = false)
    }

    fun planOutfit(outfitId: String, notes: String? = null) {
        val selectedDate = _uiState.value.selectedDate ?: return
        val dateStr = dateFormat.format(selectedDate.time)

        viewModelScope.launch {
            // Note: This would call the API to create calendar entry
            // For now, we'll just hide the sheet and reload
            hidePlanOutfit()
            loadCalendarData()
        }
    }

    fun markOutfitWorn(entryId: String) {
        viewModelScope.launch {
            // This would call the API to mark the outfit as worn
            loadCalendarData()
        }
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }

    private fun getMonthStartDate(calendar: Calendar): String {
        val cal = calendar.clone() as Calendar
        cal.set(Calendar.DAY_OF_MONTH, 1)
        return dateFormat.format(cal.time)
    }

    private fun getMonthEndDate(calendar: Calendar): String {
        val cal = calendar.clone() as Calendar
        cal.set(Calendar.DAY_OF_MONTH, cal.getActualMaximum(Calendar.DAY_OF_MONTH))
        return dateFormat.format(cal.time)
    }

    fun getDateString(calendar: Calendar): String = dateFormat.format(calendar.time)

    fun isToday(date: Calendar): Boolean {
        val today = Calendar.getInstance()
        return date.get(Calendar.YEAR) == today.get(Calendar.YEAR) &&
                date.get(Calendar.DAY_OF_YEAR) == today.get(Calendar.DAY_OF_YEAR)
    }

    fun hasOutfitPlanned(date: Calendar): Boolean {
        val dateStr = dateFormat.format(date.time)
        return _uiState.value.calendarEntries.containsKey(dateStr)
    }
}
