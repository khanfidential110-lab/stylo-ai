package com.styloai.app.ui.screens.outfits

import androidx.lifecycle.viewModelScope
import com.styloai.app.data.model.Outfit
import com.styloai.app.data.repository.OutfitRepository
import com.styloai.app.ui.base.BaseViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

data class OutfitDetailUiState(
    val outfit: Outfit? = null,
    val isDeleted: Boolean = false
)

@HiltViewModel
class OutfitDetailViewModel @Inject constructor(
    private val repository: OutfitRepository
) : BaseViewModel<OutfitDetailUiState>(OutfitDetailUiState()) {

    fun loadOutfit(id: String) {
        viewModelScope.launch {
            setLoading(true)
            repository.getOutfit(id).fold(
                onSuccess = { outfit ->
                    setLoading(false)
                    updateState { it.copy(outfit = outfit) }
                },
                onFailure = { error ->
                    setLoading(false)
                    showError(error.message ?: "Failed to load outfit details")
                }
            )
        }
    }

    fun toggleFavorite() {
        val currentOutfit = uiState.value.outfit ?: return
        viewModelScope.launch {
            repository.toggleFavorite(currentOutfit.id).fold(
                onSuccess = { updatedOutfit ->
                    updateState { it.copy(outfit = updatedOutfit) }
                },
                onFailure = { error ->
                    showError(error.message ?: "Failed to toggle favorite")
                }
            )
        }
    }

    fun deleteOutfit() {
        val currentOutfit = uiState.value.outfit ?: return
        viewModelScope.launch {
            setLoading(true)
            repository.deleteOutfit(currentOutfit.id).fold(
                onSuccess = {
                    setLoading(false)
                    updateState { it.copy(isDeleted = true) }
                },
                onFailure = { error ->
                    setLoading(false)
                    showError(error.message ?: "Failed to delete outfit")
                }
            )
        }
    }
}
