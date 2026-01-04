package com.styloai.app.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class WardrobeItem(
    val id: String,
    @SerialName("user_id") val userId: String,
    @SerialName("image_url") val imageUrl: String,
    val category: String,
    val subcategory: String? = null,
    val name: String? = null,
    @SerialName("primary_color") val primaryColor: String? = null,
    @SerialName("secondary_color") val secondaryColor: String? = null,
    val pattern: String? = null,
    val material: String? = null,
    val brand: String? = null,
    val seasons: List<String> = emptyList(),
    val occasions: List<String> = emptyList(),
    val formality: Int = 3,
    @SerialName("wear_count") val wearCount: Int = 0,
    @SerialName("last_worn") val lastWorn: String? = null,
    @SerialName("is_favorite") val isFavorite: Boolean = false,
    @SerialName("ai_tags") val aiTags: List<String> = emptyList(),
    val notes: String? = null,
    @SerialName("created_at") val createdAt: String
)

@Serializable
data class CreateWardrobeItemRequest(
    @SerialName("image_url") val imageUrl: String,
    val category: String,
    val subcategory: String? = null,
    val name: String? = null,
    @SerialName("primary_color") val primaryColor: String? = null,
    @SerialName("secondary_color") val secondaryColor: String? = null,
    val pattern: String? = null,
    val material: String? = null,
    val brand: String? = null,
    val seasons: List<String>? = null,
    val occasions: List<String>? = null,
    val formality: Int? = null,
    val notes: String? = null
)

@Serializable
data class WardrobeStats(
    @SerialName("total_items") val totalItems: Int,
    @SerialName("by_category") val byCategory: Map<String, Int>,
    @SerialName("by_color") val byColor: Map<String, Int>,
    @SerialName("most_worn") val mostWorn: List<WardrobeItem>,
    @SerialName("least_worn") val leastWorn: List<WardrobeItem>,
    val favorites: List<WardrobeItem>
)

@Serializable
data class DetectedItem(
    val category: String,
    val subcategory: String,
    @SerialName("suggested_name") val suggestedName: String,
    @SerialName("primary_color") val primaryColor: String,
    val confidence: Double,
    var isSelected: Boolean = true
)

@Serializable
data class OutfitDetectionResult(
    @SerialName("detected_items") val detectedItems: List<DetectedItem>,
    @SerialName("image_url") val imageUrl: String
)

object ClothingCategory {
    const val TOPS = "tops"
    const val BOTTOMS = "bottoms"
    const val DRESSES = "dresses"
    const val OUTERWEAR = "outerwear"
    const val FOOTWEAR = "footwear"
    const val ACCESSORIES = "accessories"

    val all = listOf(TOPS, BOTTOMS, DRESSES, OUTERWEAR, FOOTWEAR, ACCESSORIES)

    fun displayName(category: String): String = when (category) {
        TOPS -> "Tops"
        BOTTOMS -> "Bottoms"
        DRESSES -> "Dresses"
        OUTERWEAR -> "Outerwear"
        FOOTWEAR -> "Footwear"
        ACCESSORIES -> "Accessories"
        else -> category.replaceFirstChar { it.uppercase() }
    }

    fun icon(category: String): String = when (category) {
        TOPS -> "checkroom"
        BOTTOMS -> "straighten"
        DRESSES -> "woman"
        OUTERWEAR -> "ac_unit"
        FOOTWEAR -> "hiking"
        ACCESSORIES -> "watch"
        else -> "checkroom"
    }
}
