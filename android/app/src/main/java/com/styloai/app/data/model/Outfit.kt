package com.styloai.app.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class Outfit(
    val id: String,
    @SerialName("user_id") val userId: String,
    val name: String? = null,
    val items: List<WardrobeItem>,
    val occasion: String? = null,
    val season: String? = null,
    @SerialName("overall_score") val overallScore: Int? = null,
    @SerialName("color_harmony_score") val colorHarmonyScore: Int? = null,
    @SerialName("style_coherence_score") val styleCoherenceScore: Int? = null,
    @SerialName("occasion_fit_score") val occasionFitScore: Int? = null,
    @SerialName("weather_suitability_score") val weatherSuitabilityScore: Int? = null,
    @SerialName("completeness_score") val completenessScore: Int? = null,
    @SerialName("ai_feedback") val aiFeedback: String? = null,
    @SerialName("ai_suggestions") val aiSuggestions: List<String> = emptyList(),
    @SerialName("wear_count") val wearCount: Int = 0,
    @SerialName("last_worn") val lastWorn: String? = null,
    @SerialName("is_favorite") val isFavorite: Boolean = false,
    @SerialName("created_at") val createdAt: String
)

@Serializable
data class OutfitRecommendation(
    val outfit: Outfit,
    @SerialName("recommendation_reason") val recommendationReason: String,
    @SerialName("weather_info") val weatherInfo: WeatherInfo? = null,
    val occasion: String
)

@Serializable
data class CreateOutfitRequest(
    @SerialName("item_ids") val itemIds: List<String>,
    val name: String? = null,
    val occasion: String? = null,
    val season: String? = null
)

@Serializable
data class OutfitCalendarEntry(
    val id: String,
    @SerialName("user_id") val userId: String,
    @SerialName("outfit_id") val outfitId: String,
    val outfit: Outfit? = null,
    val date: String,
    val occasion: String? = null,
    val notes: String? = null,
    @SerialName("was_worn") val wasWorn: Boolean = false,
    @SerialName("created_at") val createdAt: String
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
