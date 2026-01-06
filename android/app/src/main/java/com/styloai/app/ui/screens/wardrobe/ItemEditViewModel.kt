package com.styloai.app.ui.screens.wardrobe

import android.content.Context
import android.net.Uri
import androidx.lifecycle.viewModelScope
import com.styloai.app.data.model.CreateWardrobeItemRequest
import com.styloai.app.data.repository.WardrobeRepository
import com.styloai.app.ui.base.BaseViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.launch
import java.io.File
import java.io.FileOutputStream
import java.io.InputStream
import javax.inject.Inject

data class ItemEditUiState(
    val imageUri: Uri? = null,
    val itemName: String = "",
    val category: String = "",
    val color: String = "",
    val material: String = "Cotton",
    val season: String = "Summer",
    val brand: String = "",
    val size: String = "M",
    val isAnalyzing: Boolean = false,
    val isSaving: Boolean = false,
    val saveSuccess: Boolean = false,
    val error: String? = null
)

@HiltViewModel
class ItemEditViewModel @Inject constructor(
    private val repository: WardrobeRepository,
    @ApplicationContext private val context: Context
) : BaseViewModel<ItemEditUiState>(ItemEditUiState()) {

    fun init(imageUriStr: String) {
        if (imageUriStr == "manual") {
            updateState { it.copy(imageUri = null) }
            return
        }
        val uri = Uri.parse(imageUriStr)
        updateState { it.copy(imageUri = uri) }
        analyzeImage(uri)
    }

    private fun analyzeImage(uri: Uri) {
        viewModelScope.launch {
            updateState { it.copy(isAnalyzing = true) }
            
            val file = createFileFromUri(uri)
            repository.analyzeClothing("", file).fold(
                onSuccess = { analysis ->
                    updateState { it.copy(
                        isAnalyzing = false,
                        category = analysis["category"] as? String ?: "",
                        color = analysis["primaryColor"] as? String ?: "",
                        material = analysis["material"] as? String ?: "Cotton",
                        season = (analysis["season"] as? List<String>)?.firstOrNull() ?: "Summer",
                        itemName = analysis["suggestedName"] as? String ?: ""
                    ) }
                },
                onFailure = { error ->
                    updateState { it.copy(isAnalyzing = false) }
                    showError("Failed to analyze image: ${error.message}")
                }
            )
        }
    }

    fun updateName(name: String) { updateState { it.copy(itemName = name) } }
    fun updateCategory(category: String) { updateState { it.copy(category = category) } }
    fun updateColor(color: String) { updateState { it.copy(color = color) } }
    fun updateMaterial(material: String) { updateState { it.copy(material = material) } }
    fun updateSeason(season: String) { updateState { it.copy(season = season) } }
    fun updateBrand(brand: String) { updateState { it.copy(brand = brand) } }
    fun updateSize(size: String) { updateState { it.copy(size = size) } }

    fun saveItem() {
        val state = uiState.value

        viewModelScope.launch {
            updateState { it.copy(isSaving = true) }
            
            val request = CreateWardrobeItemRequest(
                category = state.category,
                primaryColor = state.color,
                name = state.itemName,
                brand = state.brand,
                size = state.size
            )

            val file = state.imageUri?.let { createFileFromUri(it) }
            repository.createItem(request, file).fold(
                onSuccess = {
                    updateState { it.copy(isSaving = false, saveSuccess = true) }
                },
                onFailure = { error ->
                    updateState { it.copy(isSaving = false) }
                    showError("Failed to save item: ${error.message}")
                }
            )
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
            null
        }
    }

    fun clearError() {
        updateState { it.copy(error = null) }
    }
}
