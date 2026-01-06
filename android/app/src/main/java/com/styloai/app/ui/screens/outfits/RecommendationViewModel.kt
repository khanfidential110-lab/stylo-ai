package com.styloai.app.ui.screens.outfits

import androidx.lifecycle.viewModelScope
import com.styloai.app.data.model.OutfitRecommendation
import com.styloai.app.data.repository.OutfitRepository
import com.styloai.app.ui.base.BaseViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

data class RecommendationUiState(
    val recommendations: List<OutfitRecommendation> = emptyList()
)

@HiltViewModel
class RecommendationViewModel @Inject constructor(
    private val repository: OutfitRepository
) : BaseViewModel<RecommendationUiState>(RecommendationUiState()) {

    fun loadRecommendations(occasion: String? = null) {
        viewModelScope.launch {
            setLoading(true)
            repository.getRecommendations(occasion = occasion).fold(
                onSuccess = { recommendations ->
                    setLoading(false)
                    updateState { it.copy(recommendations = recommendations) }
                },
                onFailure = { error ->
                    setLoading(false)
                    showError(error.message ?: "Failed to load recommendations")
                }
            )
        }
    }
}
