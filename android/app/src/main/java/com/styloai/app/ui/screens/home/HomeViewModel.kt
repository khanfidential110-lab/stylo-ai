package com.styloai.app.ui.screens.home

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.styloai.app.data.api.StyloApiService
import com.styloai.app.data.model.*
import com.styloai.app.data.repository.OutfitRepository
import com.styloai.app.data.repository.WardrobeRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class HomeUiState(
    val isLoading: Boolean = true,
    val user: User? = null,
    val weather: WeatherInfo? = null,
    val recommendations: List<OutfitRecommendation> = emptyList(),
    val wardrobeStats: WardrobeStats? = null,
    val recentItems: List<WardrobeItem> = emptyList(),
    val error: String? = null
)

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val api: StyloApiService,
    private val outfitRepository: OutfitRepository,
    private val wardrobeRepository: WardrobeRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(HomeUiState())
    val uiState: StateFlow<HomeUiState> = _uiState

    init {
        loadDashboard()
    }

    fun loadDashboard() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)

            try {
                // Load user
                val userResponse = api.getCurrentUser()
                if (userResponse.isSuccessful) {
                    _uiState.value = _uiState.value.copy(user = userResponse.body())
                }

                // Load weather (using user's city or default)
                val city = _uiState.value.user?.city ?: "New York"
                val weatherResponse = api.getCurrentWeather(city = city)
                if (weatherResponse.isSuccessful) {
                    _uiState.value = _uiState.value.copy(weather = weatherResponse.body())
                }

                // Load recommendations
                val recommendationsResult = outfitRepository.getRecommendations()
                recommendationsResult.onSuccess { recommendations ->
                    _uiState.value = _uiState.value.copy(recommendations = recommendations)
                }

                // Load wardrobe stats
                val statsResult = wardrobeRepository.getStats()
                statsResult.onSuccess { stats ->
                    _uiState.value = _uiState.value.copy(wardrobeStats = stats)
                }

                // Load recent items
                val itemsResult = wardrobeRepository.getItems()
                itemsResult.onSuccess { items ->
                    _uiState.value = _uiState.value.copy(
                        recentItems = items.take(6)
                    )
                }

                _uiState.value = _uiState.value.copy(isLoading = false)

            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message
                )
            }
        }
    }

    fun refresh() {
        loadDashboard()
    }
}
