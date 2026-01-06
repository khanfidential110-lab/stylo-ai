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
    val filteredItems: List<WardrobeItem> = emptyList(),
    val selectedCategory: String? = null,
    val categories: List<String> = ClothingCategory.all,
    val stats: WardrobeStats? = null,
    val error: String? = null,
    val searchQuery: String = "",
    val showAddItem: Boolean = false,
    val showManualEntry: Boolean = false,
    val showItemDetail: Boolean = false,
    val selectedItem: WardrobeItem? = null,
    val selectedImageUri: Uri? = null,
    val captureMode: CaptureMode = CaptureMode.SINGLE,
    val isProcessing: Boolean = false,
    val detectedItems: List<DetectedItem> = emptyList(),
    val manualEntryData: ManualEntryData = ManualEntryData()
)

data class ManualEntryData(
    val name: String = "",
    val category: String = ClothingCategory.TOPS,
    val primaryColor: String = "",
    val material: String = "",
    val brand: String = "",
    val selectedSeasons: List<String> = emptyList(),
    val selectedOccasions: List<String> = emptyList()
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
                        items = items,
                        filteredItems = filterItems(items, _uiState.value.searchQuery)
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

    // Search functionality
    fun updateSearchQuery(query: String) {
        _uiState.value = _uiState.value.copy(
            searchQuery = query,
            filteredItems = filterItems(_uiState.value.items, query)
        )
    }

    private fun filterItems(items: List<WardrobeItem>, query: String): List<WardrobeItem> {
        if (query.isBlank()) return items
        val lowerQuery = query.lowercase()
        return items.filter { item ->
            item.name?.lowercase()?.contains(lowerQuery) == true ||
            item.category.lowercase().contains(lowerQuery) ||
            item.primaryColor?.lowercase()?.contains(lowerQuery) == true ||
            item.brand?.lowercase()?.contains(lowerQuery) == true ||
            item.material?.lowercase()?.contains(lowerQuery) == true
        }
    }

    // Item detail
    fun showItemDetail(item: WardrobeItem) {
        _uiState.value = _uiState.value.copy(
            showItemDetail = true,
            selectedItem = item
        )
    }

    fun hideItemDetail() {
        _uiState.value = _uiState.value.copy(
            showItemDetail = false,
            selectedItem = null
        )
    }

    // Manual entry
    fun showManualEntry() {
        _uiState.value = _uiState.value.copy(
            showManualEntry = true,
            manualEntryData = ManualEntryData()
        )
    }

    fun hideManualEntry() {
        _uiState.value = _uiState.value.copy(
            showManualEntry = false,
            manualEntryData = ManualEntryData()
        )
    }

    fun updateManualEntryName(name: String) {
        _uiState.value = _uiState.value.copy(
            manualEntryData = _uiState.value.manualEntryData.copy(name = name)
        )
    }

    fun updateManualEntryCategory(category: String) {
        _uiState.value = _uiState.value.copy(
            manualEntryData = _uiState.value.manualEntryData.copy(category = category)
        )
    }

    fun updateManualEntryColor(color: String) {
        _uiState.value = _uiState.value.copy(
            manualEntryData = _uiState.value.manualEntryData.copy(primaryColor = color)
        )
    }

    fun updateManualEntryMaterial(material: String) {
        _uiState.value = _uiState.value.copy(
            manualEntryData = _uiState.value.manualEntryData.copy(material = material)
        )
    }

    fun updateManualEntryBrand(brand: String) {
        _uiState.value = _uiState.value.copy(
            manualEntryData = _uiState.value.manualEntryData.copy(brand = brand)
        )
    }

    fun toggleManualEntrySeason(season: String) {
        val currentSeasons = _uiState.value.manualEntryData.selectedSeasons.toMutableList()
        if (currentSeasons.contains(season)) {
            currentSeasons.remove(season)
        } else {
            currentSeasons.add(season)
        }
        _uiState.value = _uiState.value.copy(
            manualEntryData = _uiState.value.manualEntryData.copy(selectedSeasons = currentSeasons)
        )
    }

    fun toggleManualEntryOccasion(occasion: String) {
        val currentOccasions = _uiState.value.manualEntryData.selectedOccasions.toMutableList()
        if (currentOccasions.contains(occasion)) {
            currentOccasions.remove(occasion)
        } else {
            currentOccasions.add(occasion)
        }
        _uiState.value = _uiState.value.copy(
            manualEntryData = _uiState.value.manualEntryData.copy(selectedOccasions = currentOccasions)
        )
    }

    fun saveManualEntry() {
        val data = _uiState.value.manualEntryData
        if (data.name.isBlank()) {
            _uiState.value = _uiState.value.copy(error = "Please enter a name for the item")
            return
        }

        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isProcessing = true)

            val request = CreateWardrobeItemRequest(
                imageUrl = "", // No image for manual entry
                category = data.category,
                name = data.name,
                primaryColor = data.primaryColor.ifBlank { null },
                material = data.material.ifBlank { null },
                brand = data.brand.ifBlank { null },
                seasons = data.selectedSeasons.ifEmpty { null },
                occasions = data.selectedOccasions.ifEmpty { null }
            )

            repository.createItem(request).fold(
                onSuccess = {
                    _uiState.value = _uiState.value.copy(isProcessing = false)
                    hideManualEntry()
                    loadItems()
                },
                onFailure = {
                    _uiState.value = _uiState.value.copy(
                        isProcessing = false,
                        error = "Failed to add item"
                    )
                }
            )
        }
    }

    fun markItemWorn(item: WardrobeItem) {
        viewModelScope.launch {
            repository.markWorn(item.id).onSuccess { updatedItem ->
                val updatedItems = _uiState.value.items.map {
                    if (it.id == updatedItem.id) updatedItem else it
                }
                _uiState.value = _uiState.value.copy(
                    items = updatedItems,
                    filteredItems = filterItems(updatedItems, _uiState.value.searchQuery),
                    selectedItem = if (_uiState.value.selectedItem?.id == item.id) updatedItem else _uiState.value.selectedItem
                )
            }
        }
    }
}
