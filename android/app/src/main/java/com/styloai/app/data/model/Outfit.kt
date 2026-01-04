package com.styloai.app.data.model

import com.google.gson.annotations.SerializedName

data class Outfit(
    val id: String,
    @SerializedName("user_id") val userId: String,
    val name: String? = null,
    val items: List<WardrobeItem> = emptyList(),
    val occasion: String? = null,
    val season: String? = null,
    @SerializedName("overall_score") val overallScore: Int? = null,
    @SerializedName("color_harmony_score") val colorHarmonyScore: Int? = null,
    @SerializedName("style_coherence_score") val styleCoherenceScore: Int? = null,
    @SerializedName("occasion_fit_score") val occasionFitScore: Int? = null,
    @SerializedName("weather_suitability_score") val weatherSuitabilityScore: Int? = null,
    @SerializedName("completeness_score") val completenessScore: Int? = null,
    @SerializedName("ai_feedback") val aiFeedback: String? = null,
    @SerializedName("ai_suggestions") val aiSuggestions: List<String> = emptyList(),
    @SerializedName("wear_count") val wearCount: Int = 0,
    @SerializedName("last_worn") val lastWorn: String? = null,
    @SerializedName("is_favorite") val isFavorite: Boolean = false,
    @SerializedName("created_at") val createdAt: String? = null
)

data class OutfitRecommendation(
    val outfit: Outfit,
    @SerializedName("recommendation_reason") val recommendationReason: String,
    @SerializedName("weather_info") val weatherInfo: WeatherInfo? = null,
    val occasion: String
)

data class CreateOutfitRequest(
    @SerializedName("item_ids") val itemIds: List<String>,
    val name: String? = null,
    val occasion: String? = null,
    val season: String? = null
)

data class OutfitCalendarEntry(
    val id: String,
    @SerializedName("user_id") val userId: String,
    @SerializedName("outfit_id") val outfitId: String,
    val outfit: Outfit? = null,
    val date: String,
    val occasion: String? = null,
    val notes: String? = null,
    @SerializedName("was_worn") val wasWorn: Boolean = false,
    @SerializedName("created_at") val createdAt: String? = null
)

object Occasion {
    const val WORK = "work"
    const val CASUAL = "casual"
    const val FORMAL = "formal"
    const val DATE = "date"
    const val PARTY = "party"
    const val SPORT = "sport"
    const val TRAVEL = "travel"
    const val BEACH = "beach"
    const val INTERVIEW = "interview"
    const val WEDDING = "wedding"

    val all = listOf(WORK, CASUAL, FORMAL, DATE, PARTY, SPORT, TRAVEL, BEACH, INTERVIEW, WEDDING)

    fun displayName(occasion: String): String = when (occasion) {
        WORK -> "Work"
        CASUAL -> "Casual"
        FORMAL -> "Formal"
        DATE -> "Date Night"
        PARTY -> "Party"
        SPORT -> "Sport"
        TRAVEL -> "Travel"
        BEACH -> "Beach"
        INTERVIEW -> "Interview"
        WEDDING -> "Wedding"
        else -> occasion.replaceFirstChar { it.uppercase() }
    }

    fun icon(occasion: String): String = when (occasion) {
        WORK -> "work"
        CASUAL -> "weekend"
        FORMAL -> "business_center"
        DATE -> "favorite"
        PARTY -> "celebration"
        SPORT -> "fitness_center"
        TRAVEL -> "flight"
        BEACH -> "beach_access"
        INTERVIEW -> "record_voice_over"
        WEDDING -> "church"
        else -> "event"
    }
}
