package com.styloai.app.data.model

import com.google.gson.annotations.SerializedName

enum class SubscriptionTier {
    @SerializedName("free") FREE,
    @SerializedName("premium") PREMIUM,
    @SerializedName("premium_plus") PREMIUM_PLUS;

    val displayName: String
        get() = when (this) {
            FREE -> "Free"
            PREMIUM -> "Premium"
            PREMIUM_PLUS -> "Premium+"
        }
}

enum class TemperatureUnit {
    @SerializedName("fahrenheit") FAHRENHEIT,
    @SerializedName("celsius") CELSIUS
}

data class User(
    val id: String,
    val email: String,
    val name: String? = null,
    @SerializedName("avatar_url") val avatarUrl: String? = null,
    val city: String? = null,
    val timezone: String? = null,
    @SerializedName("temperature_unit") val temperatureUnit: TemperatureUnit = TemperatureUnit.FAHRENHEIT,
    @SerializedName("subscription_tier") val subscriptionTier: SubscriptionTier = SubscriptionTier.FREE,
    @SerializedName("subscription_expires_at") val subscriptionExpiresAt: String? = null,
    @SerializedName("created_at") val createdAt: String? = null
)

data class StyleProfile(
    val id: String,
    @SerializedName("style_tags") val styleTags: List<String> = emptyList(),
    @SerializedName("preferred_colors") val preferredColors: List<String> = emptyList(),
    @SerializedName("avoided_colors") val avoidedColors: List<String> = emptyList(),
    @SerializedName("formality_preference") val formalityPreference: Int? = null,
    @SerializedName("preferred_brands") val preferredBrands: List<String> = emptyList(),
    @SerializedName("body_type") val bodyType: String? = null,
    val height: String? = null,
    @SerializedName("preferred_fit") val preferredFit: String? = null,
    @SerializedName("style_inspirations") val styleInspirations: List<String> = emptyList()
)

data class AuthTokens(
    @SerializedName("access_token") val accessToken: String,
    @SerializedName("refresh_token") val refreshToken: String,
    @SerializedName("expires_in") val expiresIn: Int
)

data class AuthResponse(
    val user: User,
    val tokens: AuthTokens
)

data class LoginRequest(
    val email: String,
    val password: String
)

data class RegisterRequest(
    val email: String,
    val password: String,
    val name: String? = null
)
