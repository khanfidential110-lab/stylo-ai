package com.styloai.app.ui.screens.wardrobe

import android.content.Context
import android.net.Uri
import androidx.lifecycle.viewModelScope
import com.styloai.app.data.model.*
import com.styloai.app.data.repository.WardrobeRepository
import com.styloai.app.ui.base.BaseViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.launch
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import javax.inject.Inject

data class WardrobeUiState(
    val items: List<WardrobeItem> = emptyList(),
    val selectedCategory: String? = null,
    val categories: List<String> = ClothingCategory.all,
    val stats: WardrobeStats? = null,
    val showAddItem: Boolean = false,
    val selectedImageUri: Uri? = null,
    val captureMode: CaptureMode = CaptureMode.OUTFIT,
    val isProcessing: Boolean = false,
    val detectedItems: List<DetectedItem> = emptyList(),
    val searchQuery: String = ""
)

enum class CaptureMode {
    SINGLE, OUTFIT
}

@HiltViewModel
class WardrobeViewModel @Inject constructor(
    private val repository: WardrobeRepository,
    @ApplicationContext private val context: Context
) : BaseViewModel<WardrobeUiState>(WardrobeUiState()) {

    init {
        loadItems()
    }

    fun loadItems(category: String? = null) {
        viewModelScope.launch {
            setLoading(true)
            updateState { it.copy(selectedCategory = category) }

            val result = repository.getItems(category = category)
            result.fold(
                onSuccess = { items ->
                    setLoading(false)
                    updateState { it.copy(items = items) }
                },
                onFailure = { error ->
                    setLoading(false)
                    showError(error.message ?: "Failed to load items")
                }
            )

            // Also load stats
            repository.getStats().onSuccess { stats ->
                updateState { it.copy(stats = stats) }
            }
        }
    }

    fun updateSearchQuery(query: String) {
        updateState { it.copy(searchQuery = query) }
    }

    fun selectCategory(category: String?) {
        loadItems(category)
    }

    fun toggleFavorite(item: WardrobeItem) {
        viewModelScope.launch {
            repository.toggleFavorite(item.id, !item.isFavorite).onSuccess { updatedItem ->
                updateState { state ->
                    val updatedItems = state.items.map {
                        if (it.id == updatedItem.id) updatedItem else it
                    }
                    state.copy(items = updatedItems)
                }
            }.onFailure { error ->
                showError(error.message ?: "Failed to update favorite")
            }
        }
    }

    fun deleteItem(item: WardrobeItem) {
        viewModelScope.launch {
            repository.deleteItem(item.id).onSuccess {
                updateState { state ->
                    val updatedItems = state.items.filter { it.id != item.id }
                    state.copy(items = updatedItems)
                }
            }.onFailure { error ->
                showError(error.message ?: "Failed to delete item")
            }
        }
    }

    fun showAddItem() {
        updateState { it.copy(showAddItem = true) }
    }

    fun hideAddItem() {
        updateState { 
            it.copy(
                showAddItem = false,
                selectedImageUri = null,
                detectedItems = emptyList()
            )
        }
    }

    fun setCaptureMode(mode: CaptureMode) {
        updateState { it.copy(captureMode = mode) }
    }

    fun setSelectedImage(uri: Uri) {
        updateState { it.copy(selectedImageUri = uri) }
    }

    fun processImage(imageUrl: String) {
        viewModelScope.launch {
            updateState { it.copy(isProcessing = true) }

            if (uiState.value.captureMode == CaptureMode.OUTFIT) {
                val uri = uiState.value.selectedImageUri
                val file = if (uri != null) createFileFromUri(uri) else null

                repository.detectOutfitItems(imageUrl, file).fold(
                    onSuccess = { result ->
                        updateState { it.copy(
                            isProcessing = false,
                            detectedItems = result.detectedItems
                        ) }
                    },
                    onFailure = { error ->
                        updateState { it.copy(isProcessing = false) }
                        showError(error.message ?: "Failed to detect items")
                    }
                )
            } else {
                 val uri = uiState.value.selectedImageUri
                 val file = if (uri != null) createFileFromUri(uri) else null

                repository.analyzeClothing(imageUrl, file).fold(
                    onSuccess = { analysis ->
                        val category = analysis["category"] as? String ?: "tops"
                        val color = analysis["primary_color"] as? String
                        val request = CreateWardrobeItemRequest(
                            imageUrl = imageUrl,
                            category = category,
                            primaryColor = color
                        )
                        
                        if (file != null) {
                            repository.createItem(request, file).fold(
                                onSuccess = {
                                    updateState { it.copy(isProcessing = false) }
                                    hideAddItem()
                                    loadItems()
                                },
                                onFailure = { error ->
                                    updateState { it.copy(isProcessing = false) }
                                    showError(error.message ?: "Failed to add item")
                                }
                            )
                        } else {
                            updateState { it.copy(isProcessing = false) }
                            showError("Failed to process image file")
                        }
                    },
                    onFailure = { error ->
                        updateState { it.copy(isProcessing = false) }
                        showError(error.message ?: "Failed to analyze image")
                    }
                )
            }
        }
    }

    fun toggleDetectedItemSelection(index: Int) {
        updateState { state ->
            val items = state.detectedItems.toMutableList()
            if (index < items.size) {
                items[index] = items[index].copy(isSelected = !items[index].isSelected)
                state.copy(detectedItems = items)
            } else state
        }
    }

    fun saveDetectedItems(imageUrl: String) {
        viewModelScope.launch {
            updateState { it.copy(isProcessing = true) }

            val selectedItems = uiState.value.detectedItems.filter { it.isSelected }
            var success = true

            selectedItems.forEach { detectedItem ->
                val request = CreateWardrobeItemRequest(
                    imageUrl = imageUrl,
                    category = detectedItem.category,
                    subcategory = detectedItem.subcategory,
                    name = detectedItem.suggestedName,
                    primaryColor = detectedItem.primaryColor
                )
                repository.createItem(request).onFailure { 
                    success = false
                }
            }

            updateState { it.copy(isProcessing = false) }
            if (!success) {
                showError("Some items failed to save")
            }
            hideAddItem()
            loadItems()
        }
    }

    private fun createFileFromUri(uri: Uri): File? {
        return try {
            val contentResolver = context.contentResolver
            val inputStream: InputStream? = contentResolver.openInputStream(uri)
            val file = File.createTempFile("upload", ".jpg", context.cacheDir)
            val outputStream = FileOutputStream(file)
            inputStream?.copyTo(outputStream)
            inputStream?.close()
            outputStream.close()
            file
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
}
