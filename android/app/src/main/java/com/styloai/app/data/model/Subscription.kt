package com.styloai.app.data.model

import com.google.gson.annotations.SerializedName

data class SubscriptionPlan(
    val id: String,
    val name: String,
    val price: Double,
    val interval: String,
    val features: List<String>,
    @SerializedName("google_product_id") val googleProductId: String
)

data class Subscription(
    val id: String,
    @SerializedName("user_id") val userId: String,
    val tier: SubscriptionTier,
    val status: String,
    @SerializedName("current_period_start") val currentPeriodStart: String,
    @SerializedName("current_period_end") val currentPeriodEnd: String,
    @SerializedName("google_subscription_id") val googleSubscriptionId: String? = null,
    @SerializedName("created_at") val createdAt: String? = null
)

data class VerifyPurchaseRequest(
    @SerializedName("purchase_token") val purchaseToken: String,
    @SerializedName("product_id") val productId: String
)

data class VerifyPurchaseResponse(
    val success: Boolean,
    val subscription: Subscription? = null,
    val message: String? = null
)

object SubscriptionFeatures {
    val free = listOf(
        "Up to 50 wardrobe items",
        "5 outfit suggestions per day",
        "Basic AI chat (10 messages/day)",
        "Weather-based recommendations"
    )

    val premium = listOf(
        "Unlimited wardrobe items",
        "Unlimited outfit suggestions",
        "Unlimited AI chat",
        "Advanced analytics",
        "No ads",
        "Priority support"
    )

    val premiumPlus = listOf(
        "Everything in Premium",
        "Personal stylist consultations",
        "Shopping recommendations",
        "Exclusive style guides",
        "Early access to features"
    )
}
