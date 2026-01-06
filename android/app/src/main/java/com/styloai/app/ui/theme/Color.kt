package com.styloai.app.ui.theme

import androidx.compose.ui.graphics.Color

// Primary - Deep Indigo M3 Palette
val md_theme_light_primary = Color(0xFF2563EB)
val md_theme_light_onPrimary = Color(0xFFFFFFFF)
val md_theme_light_primaryContainer = Color(0xFFE0E0FF)
val md_theme_light_onPrimaryContainer = Color(0xFF0500AB)

// Secondary - Soft Lilac
val md_theme_light_secondary = Color(0xFF5D5C72)
val md_theme_light_onSecondary = Color(0xFFFFFFFF)
val md_theme_light_secondaryContainer = Color(0xFFE2E0F9)
val md_theme_light_onSecondaryContainer = Color(0xFF1A1A2C)

// Tertiary - Vibrant Amber (Accents)
val md_theme_light_tertiary = Color(0xFFF59E0B)
val md_theme_light_onTertiary = Color(0xFFFFFFFF)
val md_theme_light_tertiaryContainer = Color(0xFFFFDDB6)
val md_theme_light_onTertiaryContainer = Color(0xFF2A1800)

// Error
val md_theme_light_error = Color(0xFFBA1A1A)
val md_theme_light_errorContainer = Color(0xFFFFDAD6)
val md_theme_light_onError = Color(0xFFFFFFFF)
val md_theme_light_onErrorContainer = Color(0xFF410002)

// Background & Surface
val md_theme_light_background = Color(0xFFFFFBFF)
val md_theme_light_onBackground = Color(0xFF1B1B1F)
val md_theme_light_surface = Color(0xFFFFFBFF)
val md_theme_light_onSurface = Color(0xFF1B1B1F)
val md_theme_light_surfaceVariant = Color(0xFFE3E1EC)
val md_theme_light_onSurfaceVariant = Color(0xFF46464F)
val md_theme_light_outline = Color(0xFF767680)

// Dark M3 Palette
val md_theme_dark_primary = Color(0xFFBFC2FF)
val md_theme_dark_onPrimary = Color(0xFF1F00AA)
val md_theme_dark_primaryContainer = Color(0xFF3330C8)
val md_theme_dark_onPrimaryContainer = Color(0xFFE0E0FF)

val md_theme_dark_secondary = Color(0xFFC6C4DD)
val md_theme_dark_onSecondary = Color(0xFF2F2F42)
val md_theme_dark_secondaryContainer = Color(0xFF454559)
val md_theme_dark_onSecondaryContainer = Color(0xFFE2E0F9)

val md_theme_dark_tertiary = Color(0xFFFFB86C)
val md_theme_dark_onTertiary = Color(0xFF492900)
val md_theme_dark_tertiaryContainer = Color(0xFF683D00)
val md_theme_dark_onTertiaryContainer = Color(0xFFFFDDB6)

val md_theme_dark_error = Color(0xFFFFB4AB)
val md_theme_dark_errorContainer = Color(0xFF93000A)
val md_theme_dark_onError = Color(0xFF690005)
val md_theme_dark_onErrorContainer = Color(0xFFFFDAD6)

val md_theme_dark_background = Color(0xFF1B1B1F)
val md_theme_dark_onBackground = Color(0xFFE4E1E6)
val md_theme_dark_surface = Color(0xFF1B1B1F)
val md_theme_dark_onSurface = Color(0xFFE4E1E6)
val md_theme_dark_surfaceVariant = Color(0xFF46464F)
val md_theme_dark_onSurfaceVariant = Color(0xFFC7C5D0)
val md_theme_dark_outline = Color(0xFF90909A)

// Custom Semantic Colors
val SuccessGreen = Color(0xFF10B981)
val InfoBlue = Color(0xFF3B82F6)

// Compatibility Aliases for Legacy Code
val BrandIndigo = md_theme_light_primary
val BrandIndigoLight = Color(0xFFA5B4FC)
val BrandIndigoDark = Color(0xFF4F46E5)
val AccentAmber = md_theme_light_tertiary
val ErrorRed = md_theme_light_error
val Gray100 = Color(0xFFF3F4F6)
val Gray300 = Color(0xFFD1D5DB)
val Gray400 = Color(0xFF9CA3AF) // Added back
val Gray500 = Color(0xFF6B7280) // Added back
val Gray900 = Color(0xFF111827)

// Clothing Colors Helper
object ClothingColors {
    fun colorFor(colorName: String): Color = when (colorName.lowercase()) {
        "black" -> Color(0xFF1F2937)
        "white" -> Color(0xFFF9FAFB)
        "gray", "grey" -> Color(0xFF6B7280)
        "red" -> Color(0xFFDC2626)
        "blue" -> Color(0xFF2563EB)
        "navy" -> Color(0xFF1E3A8A)
        "green" -> Color(0xFF16A34A)
        "yellow" -> Color(0xFFFACC15)
        "orange" -> Color(0xFFF97316)
        "purple" -> Color(0xFF9333EA)
        "pink" -> Color(0xFFEC4899)
        "brown" -> Color(0xFF92400E)
        "beige" -> Color(0xFFD4B896)
        "cream" -> Color(0xFFFFFDD0)
        "denim" -> Color(0xFF4169E1)
        "khaki" -> Color(0xFFC3B091)
        "olive" -> Color(0xFF556B2F)
        "burgundy" -> Color(0xFF800020)
        "coral" -> Color(0xFFFF7F50)
        "teal" -> Color(0xFF008080)
        "gold" -> Color(0xFFFFD700)
        "silver" -> Color(0xFFC0C0C0)
        else -> Color(0xFF6B7280)
    }
}
