package com.styloai.app.data.repository

import com.styloai.app.data.api.StyloApiService
import com.styloai.app.data.model.*
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class OutfitRepository @Inject constructor(
    private val api: StyloApiService
) {
    suspend fun getOutfits(): Result<List<Outfit>> {
        return try {
            val response = api.getOutfits()
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch outfits"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getOutfit(id: String): Result<Outfit> {
        return try {
            val response = api.getOutfit(id)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch outfit"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun createOutfit(request: CreateOutfitRequest): Result<Outfit> {
        return try {
            val response = api.createOutfit(request)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to create outfit"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun deleteOutfit(id: String): Result<Unit> {
        return try {
            val response = api.deleteOutfit(id)
            if (response.isSuccessful) {
                Result.success(Unit)
            } else {
                Result.failure(Exception("Failed to delete outfit"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun markWorn(id: String): Result<Outfit> {
        return try {
            val response = api.markOutfitWorn(id)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to mark outfit as worn"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun toggleFavorite(id: String): Result<Outfit> {
        return try {
            val response = api.toggleOutfitFavorite(id)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to toggle favorite"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun analyzeOutfit(itemIds: List<String>): Result<Outfit> {
        return try {
            val response = api.analyzeOutfit(mapOf("item_ids" to itemIds))
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to analyze outfit"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getRecommendations(
        occasion: String? = null,
        includeWeather: Boolean = true
    ): Result<List<OutfitRecommendation>> {
        return try {
            val response = api.getOutfitRecommendations(occasion, includeWeather)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to get recommendations"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun getCalendarEntries(startDate: String, endDate: String): Result<List<OutfitCalendarEntry>> {
        return try {
            val response = api.getCalendarEntries(startDate, endDate)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to get calendar"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
