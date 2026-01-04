package com.styloai.app.data.repository

import com.styloai.app.data.api.StyloApiService
import com.styloai.app.data.model.*
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class WardrobeRepository @Inject constructor(
    private val api: StyloApiService
) {
    suspend fun getItems(
        category: String? = null,
        season: String? = null,
        occasion: String? = null
    ): Result<List<WardrobeItem>> {
        return try {
            val response = api.getWardrobeItems(category, season, occasion)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch wardrobe items"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getItem(id: String): Result<WardrobeItem> {
        return try {
            val response = api.getWardrobeItem(id)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch item"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun createItem(request: CreateWardrobeItemRequest): Result<WardrobeItem> {
        return try {
            val response = api.createWardrobeItem(request)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to create item"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun updateItem(id: String, updates: Map<String, Any>): Result<WardrobeItem> {
        return try {
            val response = api.updateWardrobeItem(id, updates)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to update item"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun deleteItem(id: String): Result<Unit> {
        return try {
            val response = api.deleteWardrobeItem(id)
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception("Failed to delete item"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getStats(): Result<WardrobeStats> {
        return try {
            val response = api.getWardrobeStats()
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch stats"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun analyzeClothing(imageUrl: String): Result<Map<String, Any>> {
        return try {
            val response = api.analyzeClothing(mapOf("image_url" to imageUrl))
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to analyze clothing"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun detectOutfitItems(imageUrl: String): Result<OutfitDetectionResult> {
        return try {
            val response = api.detectOutfitItems(mapOf("image_url" to imageUrl))
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to detect items"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun toggleFavorite(id: String, isFavorite: Boolean): Result<WardrobeItem> {
        return updateItem(id, mapOf("is_favorite" to isFavorite))
    }
}
