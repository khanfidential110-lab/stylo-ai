package com.styloai.app.ui.screens.outfits

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.styloai.app.data.model.*
import com.styloai.app.data.repository.OutfitRepository
import com.styloai.app.data.repository.WardrobeRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class OutfitsUiState(
    val isLoading: Boolean = true,
    val outfits: List<Outfit> = emptyList(),
    val recommendations: List<OutfitRecommendation> = emptyList(),
    val wardrobeItems: List<WardrobeItem> = emptyList(),
    val selectedItems: List<WardrobeItem> = emptyList(),
    val showCreateOutfit: Boolean = false,
    val isAnalyzing: Boolean = false,
    val analyzedOutfit: Outfit? = null,
    val selectedOccasion: String? = null,
    val outfitName: String = "",
    val error: String? = null,
    val successMessage: String? = null
)

@HiltViewModel
class OutfitsViewModel @Inject constructor(
    private val outfitRepository: OutfitRepository,
    private val wardrobeRepository: WardrobeRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(OutfitsUiState())
    val uiState: StateFlow<OutfitsUiState> = _uiState

    init {
        loadData()
    }

    fun loadData() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)

            // Load outfits
            outfitRepository.getOutfits().fold(
                onSuccess = { outfits ->
                    _uiState.value = _uiState.value.copy(outfits = outfits)
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(error = error.message)
                }
            )

            // Load recommendations
            outfitRepository.getRecommendations().onSuccess { recommendations ->
                _uiState.value = _uiState.value.copy(recommendations = recommendations)
            }

            // Load wardrobe items for creating outfits
            wardrobeRepository.getItems().onSuccess { items ->
                _uiState.value = _uiState.value.copy(wardrobeItems = items)
            }

            _uiState.value = _uiState.value.copy(isLoading = false)
        }
    }

    fun showCreateOutfit() {
        _uiState.value = _uiState.value.copy(
            showCreateOutfit = true,
            selectedItems = emptyList(),
            analyzedOutfit = null,
            outfitName = "",
            selectedOccasion = null
        )
    }

    fun hideCreateOutfit() {
        _uiState.value = _uiState.value.copy(
            showCreateOutfit = false,
            selectedItems = emptyList(),
            analyzedOutfit = null,
            isAnalyzing = false
        )
    }

    fun toggleItemSelection(item: WardrobeItem) {
        val currentSelection = _uiState.value.selectedItems.toMutableList()
        if (currentSelection.any { it.id == item.id }) {
            currentSelection.removeAll { it.id == item.id }
        } else {
            currentSelection.add(item)
        }
        _uiState.value = _uiState.value.copy(
            selectedItems = currentSelection,
            analyzedOutfit = null // Reset analysis when selection changes
        )
    }

    fun isItemSelected(item: WardrobeItem): Boolean {
        return _uiState.value.selectedItems.any { it.id == item.id }
    }

    fun setOutfitName(name: String) {
        _uiState.value = _uiState.value.copy(outfitName = name)
    }

    fun setOccasion(occasion: String?) {
        _uiState.value = _uiState.value.copy(selectedOccasion = occasion)
    }

    fun analyzeOutfit() {
        if (_uiState.value.selectedItems.isEmpty()) return

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isAnalyzing = true)

            val itemIds = _uiState.value.selectedItems.map { it.id }
            outfitRepository.analyzeOutfit(itemIds).fold(
                onSuccess = { outfit ->
                    _uiState.value = _uiState.value.copy(
                        isAnalyzing = false,
                        analyzedOutfit = outfit
                    )
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(
                        isAnalyzing = false,
                        error = error.message
                    )
                }
            )
        }
    }

    fun saveOutfit() {
        if (_uiState.value.selectedItems.isEmpty()) return

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isAnalyzing = true)

            val request = CreateOutfitRequest(
                itemIds = _uiState.value.selectedItems.map { it.id },
                name = _uiState.value.outfitName.ifBlank { null },
                occasion = _uiState.value.selectedOccasion
            )

            outfitRepository.createOutfit(request).fold(
                onSuccess = { outfit ->
                    _uiState.value = _uiState.value.copy(
                        isAnalyzing = false,
                        successMessage = "Outfit saved!"
                    )
                    hideCreateOutfit()
                    loadData()
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(
                        isAnalyzing = false,
                        error = error.message
                    )
                }
            )
        }
    }

    fun deleteOutfit(outfit: Outfit) {
        viewModelScope.launch {
            outfitRepository.deleteOutfit(outfit.id).fold(
                onSuccess = {
                    val updatedOutfits = _uiState.value.outfits.filter { it.id != outfit.id }
                    _uiState.value = _uiState.value.copy(outfits = updatedOutfits)
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(error = error.message)
                }
            )
        }
    }

    fun toggleFavorite(outfit: Outfit) {
        viewModelScope.launch {
            outfitRepository.toggleFavorite(outfit.id).fold(
                onSuccess = { updatedOutfit ->
                    val updatedOutfits = _uiState.value.outfits.map {
                        if (it.id == updatedOutfit.id) updatedOutfit else it
                    }
                    _uiState.value = _uiState.value.copy(outfits = updatedOutfits)
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(error = error.message)
                }
            )
        }
    }

    fun markWorn(outfit: Outfit) {
        viewModelScope.launch {
            outfitRepository.markWorn(outfit.id).fold(
                onSuccess = { updatedOutfit ->
                    val updatedOutfits = _uiState.value.outfits.map {
                        if (it.id == updatedOutfit.id) updatedOutfit else it
                    }
                    _uiState.value = _uiState.value.copy(
                        outfits = updatedOutfits,
                        successMessage = "Marked as worn!"
                    )
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(error = error.message)
                }
            )
        }
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }

    fun clearSuccessMessage() {
        _uiState.value = _uiState.value.copy(successMessage = null)
    }
}
