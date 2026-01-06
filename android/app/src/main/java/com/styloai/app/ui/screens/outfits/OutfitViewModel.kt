package com.styloai.app.ui.screens.outfits

import androidx.lifecycle.viewModelScope
import com.styloai.app.data.model.Outfit
import com.styloai.app.data.repository.OutfitRepository
import com.styloai.app.ui.base.BaseViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

data class OutfitUiState(
    val outfits: List<Outfit> = emptyList()
)

@HiltViewModel
class OutfitViewModel @Inject constructor(
    private val repository: OutfitRepository
) : BaseViewModel<OutfitUiState>(OutfitUiState()) {

    init {
        loadOutfits()
    }

    fun loadOutfits() {
        viewModelScope.launch {
            setLoading(true)
            repository.getOutfits().fold(
                onSuccess = { outfits ->
                    setLoading(false)
                    updateState { it.copy(outfits = outfits) }
                },
                onFailure = { error ->
                    setLoading(false)
                    showError(error.message ?: "Failed to fetch outfits")
                }
            )
        }
    }

    fun toggleFavorite(outfit: Outfit) {
        viewModelScope.launch {
            repository.toggleFavorite(outfit.id).fold(
                onSuccess = { updatedOutfit ->
                    updateState { state ->
                        val updatedOutfits = state.outfits.map {
                            if (it.id == updatedOutfit.id) updatedOutfit else it
                        }
                        state.copy(outfits = updatedOutfits)
                    }
                },
                onFailure = { error ->
                    showError(error.message ?: "Failed to toggle favorite")
                }
            )
        }
    }

    fun deleteOutfit(outfitId: String) {
        viewModelScope.launch {
            setLoading(true)
            repository.deleteOutfit(outfitId).fold(
                onSuccess = {
                    setLoading(false)
                    updateState { state ->
                        state.copy(outfits = state.outfits.filter { it.id != outfitId })
                    }
                },
                onFailure = { error ->
                    setLoading(false)
                    showError(error.message ?: "Failed to delete outfit")
                }
            )
        }
    }
}
