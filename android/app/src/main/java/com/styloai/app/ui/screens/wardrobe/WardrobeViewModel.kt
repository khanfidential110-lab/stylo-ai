package com.styloai.app.ui.screens.wardrobe

import android.net.Uri
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.styloai.app.data.model.*
import com.styloai.app.data.repository.WardrobeRepository
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class WardrobeUiState(
    val isLoading: Boolean = true,
    val items: List<WardrobeItem> = emptyList(),
    val selectedCategory: String? = null,
    val categories: List<String> = ClothingCategory.all,
    val stats: WardrobeStats? = null,
    val error: String? = null,
    val showAddItem: Boolean = false,
    val selectedImageUri: Uri? = null,
    val captureMode: CaptureMode = CaptureMode.SINGLE,
    val isProcessing: Boolean = false,
    val detectedItems: List<DetectedItem> = emptyList()
)

enum class CaptureMode {
    SINGLE, OUTFIT
}

@HiltViewModel
class WardrobeViewModel @Inject constructor(
    private val repository: WardrobeRepository
) : ViewModel() {

    private val _uiState = MutableStateFlow(WardrobeUiState())
    val uiState: StateFlow<WardrobeUiState> = _uiState

    init {
        loadItems()
    }

    fun loadItems(category: String? = null) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(
                isLoading = true,
                selectedCategory = category
            )

            val result = repository.getItems(category = category)
            result.fold(
                onSuccess = { items ->
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        items = items
                    )
                },
                onFailure = { error ->
                    _uiState.value = _uiState.value.copy(
                        isLoading = false,
                        error = error.message
                    )
                }
            )

            // Also load stats
            repository.getStats().onSuccess { stats ->
                _uiState.value = _uiState.value.copy(stats = stats)
            }
        }
    }

    fun selectCategory(category: String?) {
        loadItems(category)
    }

    fun toggleFavorite(item: WardrobeItem) {
        viewModelScope.launch {
            repository.toggleFavorite(item.id, !item.isFavorite).onSuccess { updatedItem ->
                val updatedItems = _uiState.value.items.map {
                    if (it.id == updatedItem.id) updatedItem else it
                }
                _uiState.value = _uiState.value.copy(items = updatedItems)
            }
        }
    }

    fun deleteItem(item: WardrobeItem) {
        viewModelScope.launch {
            repository.deleteItem(item.id).onSuccess {
                val updatedItems = _uiState.value.items.filter { it.id != item.id }
                _uiState.value = _uiState.value.copy(items = updatedItems)
            }
        }
    }

    fun showAddItem() {
        _uiState.value = _uiState.value.copy(showAddItem = true)
    }

    fun hideAddItem() {
        _uiState.value = _uiState.value.copy(
            showAddItem = false,
            selectedImageUri = null,
            detectedItems = emptyList()
        )
    }

    fun setCaptureMode(mode: CaptureMode) {
        _uiState.value = _uiState.value.copy(captureMode = mode)
    }

    fun setSelectedImage(uri: Uri) {
        _uiState.value = _uiState.value.copy(selectedImageUri = uri)
    }

    fun processImage(imageUrl: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isProcessing = true)

            if (_uiState.value.captureMode == CaptureMode.OUTFIT) {
                // Detect multiple items from outfit photo
                repository.detectOutfitItems(imageUrl).fold(
                    onSuccess = { result ->
                        _uiState.value = _uiState.value.copy(
                            isProcessing = false,
                            detectedItems = result.detectedItems
                        )
                    },
                    onFailure = {
                        _uiState.value = _uiState.value.copy(
                            isProcessing = false,
                            error = "Failed to detect items"
                        )
                    }
                )
            } else {
                // Single item mode - analyze and create
                repository.analyzeClothing(imageUrl).fold(
                    onSuccess = { analysis ->
                        val category = analysis["category"] as? String ?: "tops"
                        val color = analysis["primary_color"] as? String
                        val request = CreateWardrobeItemRequest(
                            imageUrl = imageUrl,
                            category = category,
                            primaryColor = color
                        )
                        repository.createItem(request).fold(
                            onSuccess = {
                                _uiState.value = _uiState.value.copy(isProcessing = false)
                                hideAddItem()
                                loadItems()
                            },
                            onFailure = {
                                _uiState.value = _uiState.value.copy(
                                    isProcessing = false,
                                    error = "Failed to add item"
                                )
                            }
                        )
                    },
                    onFailure = {
                        _uiState.value = _uiState.value.copy(
                            isProcessing = false,
                            error = "Failed to analyze image"
                        )
                    }
                )
            }
        }
    }

    fun toggleDetectedItemSelection(index: Int) {
        val items = _uiState.value.detectedItems.toMutableList()
        if (index < items.size) {
            items[index] = items[index].copy(isSelected = !items[index].isSelected)
            _uiState.value = _uiState.value.copy(detectedItems = items)
        }
    }

    fun saveDetectedItems(imageUrl: String) {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isProcessing = true)

            val selectedItems = _uiState.value.detectedItems.filter { it.isSelected }
            var successCount = 0

            selectedItems.forEach { detectedItem ->
                val request = CreateWardrobeItemRequest(
                    imageUrl = imageUrl,
                    category = detectedItem.category,
                    subcategory = detectedItem.subcategory,
                    name = detectedItem.suggestedName,
                    primaryColor = detectedItem.primaryColor
                )
                repository.createItem(request).onSuccess {
                    successCount++
                }
            }

            _uiState.value = _uiState.value.copy(isProcessing = false)
            hideAddItem()
            loadItems()
        }
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
}
