package com.styloai.app.ui.screens.home

import androidx.lifecycle.viewModelScope
import com.styloai.app.data.api.StyloApiService
import com.styloai.app.data.model.*
import com.styloai.app.data.repository.OutfitRepository
import com.styloai.app.data.repository.WardrobeRepository
import com.styloai.app.ui.base.BaseViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

data class HomeUiState(
    val user: User? = null,
    val weather: WeatherData? = null,
    val recommendations: List<OutfitRecommendation> = emptyList(),
    val wardrobeStats: WardrobeStats? = null,
    val recentItems: List<WardrobeItem> = emptyList()
)

@HiltViewModel
class HomeViewModel @Inject constructor(
    private val api: StyloApiService,
    private val outfitRepository: OutfitRepository,
    private val wardrobeRepository: WardrobeRepository
) : BaseViewModel<HomeUiState>(HomeUiState()) {

    init {
        loadDashboard()
    }

    fun loadDashboard() {
        viewModelScope.launch {
            setLoading(true)

            try {
                // Load user
                val userResponse = api.getCurrentUser()
                if (userResponse.isSuccessful) {
                    updateState { it.copy(user = userResponse.body()) }
                }

                // Load weather (using user's city or default)
                val city = uiState.value.user?.city ?: "New York"
                val weatherResponse = api.getCurrentWeather(city = city)
                if (weatherResponse.isSuccessful && weatherResponse.body() != null) {
                    updateState { it.copy(weather = weatherResponse.body()!!.weather) }
                }

                // Load recommendations
                val recommendationsResult = outfitRepository.getRecommendations()
                recommendationsResult.onSuccess { recommendations ->
                    updateState { it.copy(recommendations = recommendations) }
                }

                // Load wardrobe stats
                val statsResult = wardrobeRepository.getStats()
                statsResult.onSuccess { stats ->
                    updateState { it.copy(wardrobeStats = stats) }
                }

                // Load recent items
                val itemsResult = wardrobeRepository.getItems()
                itemsResult.onSuccess { items ->
                    updateState { it.copy(recentItems = items.take(6)) }
                }

                setLoading(false)

            } catch (e: Exception) {
                setLoading(false)
                showError(e.message ?: "Failed to load dashboard")
            }
        }
    }

    fun refresh() {
        loadDashboard()
    }
}
