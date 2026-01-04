package com.styloai.app.ui.theme

import androidx.compose.ui.graphics.Color

// Brand Colors
val BrandIndigo = Color(0xFF5B4CDB)
val BrandIndigoLight = Color(0xFF8B7FE8)
val BrandIndigoDark = Color(0xFF3B2DB5)

// Accent Colors
val AccentAmber = Color(0xFFF59E0B)
val AccentAmberLight = Color(0xFFFBBF24)

// Semantic Colors
val SuccessGreen = Color(0xFF10B981)
val ErrorRed = Color(0xFFEF4444)
val WarningYellow = Color(0xFFF59E0B)
val InfoBlue = Color(0xFF3B82F6)

// Neutral Colors
val Gray50 = Color(0xFFF9FAFB)
val Gray100 = Color(0xFFF3F4F6)
val Gray200 = Color(0xFFE5E7EB)
val Gray300 = Color(0xFFD1D5DB)
val Gray400 = Color(0xFF9CA3AF)
val Gray500 = Color(0xFF6B7280)
val Gray600 = Color(0xFF4B5563)
val Gray700 = Color(0xFF374151)
val Gray800 = Color(0xFF1F2937)
val Gray900 = Color(0xFF111827)

// Clothing Colors Map
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
