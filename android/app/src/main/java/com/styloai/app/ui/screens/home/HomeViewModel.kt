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
    val styleTips: List<String> = emptyList(),
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
                    val weather = weatherResponse.body()
                    _uiState.value = _uiState.value.copy(
                        weather = weather,
                        styleTips = generateStyleTips(weather)
                    )
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

    private fun generateStyleTips(weather: WeatherInfo?): List<String> {
        if (weather == null) return emptyList()

        val tips = mutableListOf<String>()
        val temp = weather.temperature
        val condition = weather.condition.lowercase()

        // Temperature-based tips
        when {
            temp < 32 -> {
                tips.add("Layer up! Start with a thermal base layer for maximum warmth.")
                tips.add("Don't forget accessories - hat, gloves, and a scarf are essential today.")
                tips.add("Choose dark colors to absorb more warmth from the sun.")
            }
            temp < 50 -> {
                tips.add("A cozy sweater with a light jacket is perfect for today.")
                tips.add("Consider wearing boots - they're stylish and practical.")
                tips.add("Earth tones like burgundy and olive work great in cold weather.")
            }
            temp < 65 -> {
                tips.add("Layer with a cardigan or light jacket you can remove if needed.")
                tips.add("This is perfect weather for your favorite denim jacket.")
                tips.add("Try mixing textures - a knit top with tailored pants looks polished.")
            }
            temp < 75 -> {
                tips.add("Light fabrics like cotton and linen will keep you comfortable.")
                tips.add("This is ideal weather to experiment with bold colors!")
                tips.add("A light scarf can add a stylish touch without overheating.")
            }
            temp < 85 -> {
                tips.add("Opt for breathable fabrics like cotton or moisture-wicking materials.")
                tips.add("Light colors reflect heat and keep you cooler.")
                tips.add("Loose-fitting clothes allow better air circulation.")
            }
            else -> {
                tips.add("Stay cool in flowy, loose-fitting garments.")
                tips.add("White and pastels will help reflect the sun's heat.")
                tips.add("Linen is your best friend - it's cool and looks effortlessly chic.")
            }
        }

        // Condition-based tips
        when {
            condition.contains("rain") || condition.contains("drizzle") -> {
                tips.add("Waterproof outerwear is a must - choose a stylish trench coat!")
                tips.add("Skip suede and leather shoes today - opt for water-resistant options.")
            }
            condition.contains("snow") -> {
                tips.add("Waterproof boots with good grip will keep you safe and dry.")
                tips.add("A puffer jacket provides warmth without bulk.")
            }
            condition.contains("wind") -> {
                tips.add("A windbreaker or structured coat will keep the chill out.")
                tips.add("Secure your hairstyle - today's not the day for loose curls!")
            }
            condition.contains("sun") || condition.contains("clear") -> {
                tips.add("Don't forget your sunglasses - they're a style essential!")
                tips.add("A hat can add flair while protecting you from the sun.")
            }
        }

        return tips.take(3) // Return top 3 tips
    }
}
