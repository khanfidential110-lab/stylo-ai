package com.styloai.app.data.model

import com.google.gson.annotations.SerializedName

data class WardrobeItem(
    val id: String,
    @SerializedName("user_id") val userId: String,
    @SerializedName("image_url") val imageUrl: String,
    val category: String,
    val subcategory: String? = null,
    val name: String? = null,
    @SerializedName("primary_color") val primaryColor: String? = null,
    @SerializedName("secondary_color") val secondaryColor: String? = null,
    val pattern: String? = null,
    val material: String? = null,
    val brand: String? = null,
    val size: String? = null,
    val seasons: List<String> = emptyList(),
    val occasions: List<String> = emptyList(),
    val formality: Int = 3,
    @SerializedName("wear_count") val wearCount: Int = 0,
    @SerializedName("last_worn") val lastWorn: String? = null,
    @SerializedName("is_favorite") val isFavorite: Boolean = false,
    @SerializedName("ai_tags") val aiTags: List<String> = emptyList(),
    val notes: String? = null,
    @SerializedName("created_at") val createdAt: String? = null
)

data class CreateWardrobeItemRequest(
    @SerializedName("image_url") val imageUrl: String? = null,
    val category: String,
    val subcategory: String? = null,
    val name: String? = null,
    @SerializedName("primary_color") val primaryColor: String? = null,
    @SerializedName("secondary_color") val secondaryColor: String? = null,
    val pattern: String? = null,
    val material: String? = null,
    val brand: String? = null,
    val size: String? = null,
    val seasons: List<String>? = null,
    val occasions: List<String>? = null,
    val formality: Int? = null,
    val notes: String? = null
)

data class WardrobeStats(
    @SerializedName("total_items") val totalItems: Int,
    @SerializedName("by_category") val byCategory: Map<String, Int>,
    @SerializedName("by_color") val byColor: Map<String, Int>,
    @SerializedName("most_worn") val mostWorn: List<WardrobeItem>,
    @SerializedName("least_worn") val leastWorn: List<WardrobeItem>,
    val favorites: List<WardrobeItem>
)

data class DetectedItem(
    val category: String,
    val subcategory: String,
    @SerializedName("suggested_name") val suggestedName: String,
    @SerializedName("primary_color") val primaryColor: String,
    val confidence: Double,
    var isSelected: Boolean = true
)

data class OutfitDetectionResult(
    @SerializedName("detected_items") val detectedItems: List<DetectedItem>,
    @SerializedName("image_url") val imageUrl: String
)

data class PaginatedWardrobeResponse(
    val items: List<WardrobeItem>,
    val total: Int,
    val page: Int,
    val limit: Int,
    val totalPages: Int
)

data class PaginatedOutfitResponse(
    val outfits: List<Outfit>,
    val total: Int,
    val page: Int,
    val limit: Int,
    val totalPages: Int
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
