package com.styloai.app.data.repository

import com.styloai.app.data.api.StyloApiService
import com.styloai.app.data.model.Outfit
import com.styloai.app.data.model.OutfitCalendarEntry
import javax.inject.Inject
import javax.inject.Singleton

@Singleton
class CalendarRepository @Inject constructor(
    private val api: StyloApiService
) {
    suspend fun getCalendarEntries(startDate: String, endDate: String): Result<List<OutfitCalendarEntry>> {
        return try {
            val response = api.getCalendarEntries(startDate, endDate)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to fetch calendar entries"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun createCalendarEntry(date: String, outfitId: String, occasion: String? = null): Result<OutfitCalendarEntry> {
        return try {
            val body = mutableMapOf(
                "date" to date,
                "outfit_id" to outfitId
            )
            occasion?.let { body["occasion"] = it }
            
            val response = api.createCalendarEntry(body)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to create calendar entry"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun markOutfitWorn(outfitId: String): Result<Outfit> {
        return try {
            val response = api.markOutfitWorn(outfitId)
            if (response.isSuccessful && response.body() != null) {
                Result.success(response.body()!!)
            } else {
                Result.failure(Exception("Failed to mark outfit as worn"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
