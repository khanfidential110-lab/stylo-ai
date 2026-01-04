package com.styloai.app.data.model

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class WeatherInfo(
    val temperature: Double,
    @SerialName("feels_like") val feelsLike: Double,
    val humidity: Int,
    @SerialName("wind_speed") val windSpeed: Double,
    val condition: String,
    val icon: String,
    val description: String
)

@Serializable
data class WeatherForecast(
    val current: WeatherInfo,
    val hourly: List<HourlyForecast>,
    val daily: List<DailyForecast>
)

@Serializable
data class HourlyForecast(
    val time: String,
    val temperature: Double,
    val condition: String,
    val icon: String,
    @SerialName("precipitation_chance") val precipitationChance: Int
)

@Serializable
data class DailyForecast(
    val date: String,
    @SerialName("temp_high") val tempHigh: Double,
    @SerialName("temp_low") val tempLow: Double,
    val condition: String,
    val icon: String,
    @SerialName("precipitation_chance") val precipitationChance: Int
)

object WeatherCondition {
    fun icon(condition: String): String = when (condition.lowercase()) {
        "clear" -> "wb_sunny"
        "sunny" -> "wb_sunny"
        "clouds", "cloudy" -> "cloud"
        "partly cloudy" -> "partly_cloudy_day"
        "rain", "rainy" -> "rainy"
        "drizzle" -> "grain"
        "thunderstorm" -> "thunderstorm"
        "snow", "snowy" -> "ac_unit"
        "mist", "fog", "haze" -> "foggy"
        "windy" -> "air"
        else -> "wb_sunny"
    }

    fun clothingRecommendation(temp: Double, condition: String): String {
        val tempAdvice = when {
            temp < 32 -> "Bundle up! It's freezing. Wear heavy layers, a warm coat, hat, and gloves."
            temp < 50 -> "It's cold. A warm jacket or coat is recommended."
            temp < 65 -> "It's cool. Consider wearing layers or a light jacket."
            temp < 75 -> "Perfect weather! Most outfits will work well."
            temp < 85 -> "It's warm. Light, breathable fabrics are best."
            else -> "It's hot! Wear light, loose-fitting clothes to stay cool."
        }

        val conditionAdvice = when (condition.lowercase()) {
            "rain", "rainy", "drizzle" -> " Don't forget an umbrella or rain jacket!"
            "thunderstorm" -> " Stay dry with waterproof outerwear!"
            "snow", "snowy" -> " Wear waterproof boots and warm layers!"
            "windy" -> " A windbreaker would be helpful!"
            else -> ""
        }

        return tempAdvice + conditionAdvice
    }
}
