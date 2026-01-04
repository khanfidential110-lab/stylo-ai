package com.styloai.app.ui.theme

import android.app.Activity
import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.SideEffect
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.toArgb
import androidx.compose.ui.platform.LocalView
import androidx.core.view.WindowCompat

private val LightColorScheme = lightColorScheme(
    primary = BrandIndigo,
    onPrimary = Color.White,
    primaryContainer = BrandIndigoLight,
    onPrimaryContainer = Color.White,
    secondary = AccentAmber,
    onSecondary = Color.White,
    secondaryContainer = AccentAmberLight,
    onSecondaryContainer = Gray900,
    tertiary = SuccessGreen,
    onTertiary = Color.White,
    error = ErrorRed,
    onError = Color.White,
    background = Gray50,
    onBackground = Gray900,
    surface = Color.White,
    onSurface = Gray900,
    surfaceVariant = Gray100,
    onSurfaceVariant = Gray600,
    outline = Gray300
)

private val DarkColorScheme = darkColorScheme(
    primary = BrandIndigoLight,
    onPrimary = Gray900,
    primaryContainer = BrandIndigo,
    onPrimaryContainer = Color.White,
    secondary = AccentAmberLight,
    onSecondary = Gray900,
    secondaryContainer = AccentAmber,
    onSecondaryContainer = Color.White,
    tertiary = SuccessGreen,
    onTertiary = Color.White,
    error = ErrorRed,
    onError = Color.White,
    background = Gray900,
    onBackground = Gray50,
    surface = Gray800,
    onSurface = Gray50,
    surfaceVariant = Gray700,
    onSurfaceVariant = Gray300,
    outline = Gray600
)

@Composable
fun StyloAITheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit
) {
    val colorScheme = if (darkTheme) DarkColorScheme else LightColorScheme

    val view = LocalView.current
    if (!view.isInEditMode) {
        SideEffect {
            val window = (view.context as Activity).window
            window.statusBarColor = colorScheme.primary.toArgb()
            WindowCompat.getInsetsController(window, view).isAppearanceLightStatusBars = false
        }
    }

    MaterialTheme(
        colorScheme = colorScheme,
        typography = Typography,
        content = content
    )
}
