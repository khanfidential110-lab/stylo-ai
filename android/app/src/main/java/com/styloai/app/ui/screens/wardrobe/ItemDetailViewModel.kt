package com.styloai.app.ui.screens.wardrobe

import androidx.lifecycle.viewModelScope
import com.styloai.app.data.model.WardrobeItem
import com.styloai.app.data.repository.WardrobeRepository
import com.styloai.app.ui.base.BaseViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ItemDetailUiState(
    val item: WardrobeItem? = null
)

@HiltViewModel
class ItemDetailViewModel @Inject constructor(
    private val repository: WardrobeRepository
) : BaseViewModel<ItemDetailUiState>(ItemDetailUiState()) {

    fun loadItem(id: String) {
        viewModelScope.launch {
            setLoading(true)
            repository.getItem(id).fold(
                onSuccess = { item ->
                    updateState { it.copy(item = item) }
                    setLoading(false)
                },
                onFailure = { error ->
                    setLoading(false)
                    showError("Failed to load item: ${error.message}")
                }
            )
        }
    }

    fun toggleFavorite() {
        val currentItem = uiState.value.item ?: return
        viewModelScope.launch {
            repository.toggleFavorite(currentItem.id, !currentItem.isFavorite).fold(
                onSuccess = { updatedItem ->
                    updateState { it.copy(item = updatedItem) }
                },
                onFailure = { error ->
                    showError("Failed to update favorite: ${error.message}")
                }
            )
        }
    }

    fun deleteItem(onSuccess: () -> Unit) {
        val currentItem = uiState.value.item ?: return
        viewModelScope.launch {
            setLoading(true)
            repository.deleteItem(currentItem.id).fold(
                onSuccess = {
                    setLoading(false)
                    onSuccess()
                },
                onFailure = { error ->
                    setLoading(false)
                    showError("Failed to delete item: ${error.message}")
                }
            )
        }
    }
}
