package com.styloai.app.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
enum class SubscriptionTier {
    @SerialName("free") FREE,
    @SerialName("premium") PREMIUM,
    @SerialName("premium_plus") PREMIUM_PLUS;

    val displayName: String
        get() = when (this) {
            FREE -> "Free"
            PREMIUM -> "Premium"
            PREMIUM_PLUS -> "Premium+"
        }
}

@Serializable
enum class TemperatureUnit {
    @SerialName("fahrenheit") FAHRENHEIT,
    @SerialName("celsius") CELSIUS
}

@Serializable
data class User(
    val id: String,
    val email: String,
    val name: String? = null,
    @SerialName("avatar_url") val avatarUrl: String? = null,
    val city: String? = null,
    val timezone: String? = null,
    @SerialName("temperature_unit") val temperatureUnit: TemperatureUnit = TemperatureUnit.FAHRENHEIT,
    @SerialName("subscription_tier") val subscriptionTier: SubscriptionTier = SubscriptionTier.FREE,
    @SerialName("subscription_expires_at") val subscriptionExpiresAt: String? = null,
    @SerialName("created_at") val createdAt: String
)

@Serializable
data class StyleProfile(
    val id: String,
    @SerialName("style_tags") val styleTags: List<String> = emptyList(),
    @SerialName("preferred_colors") val preferredColors: List<String> = emptyList(),
    @SerialName("avoided_colors") val avoidedColors: List<String> = emptyList(),
    @SerialName("formality_preference") val formalityPreference: Int? = null,
    @SerialName("preferred_brands") val preferredBrands: List<String> = emptyList(),
    @SerialName("body_type") val bodyType: String? = null,
    val height: String? = null,
    @SerialName("preferred_fit") val preferredFit: String? = null,
    @SerialName("style_inspirations") val styleInspirations: List<String> = emptyList()
)

@Serializable
data class AuthTokens(
    @SerialName("access_token") val accessToken: String,
    @SerialName("refresh_token") val refreshToken: String,
    @SerialName("expires_in") val expiresIn: Int
)

@Serializable
data class AuthResponse(
    val user: User,
    val tokens: AuthTokens
)

@Serializable
data class LoginRequest(
    val email: String,
    val password: String
)

@Serializable
data class RegisterRequest(
    val email: String,
    val password: String,
    val name: String? = null
)
