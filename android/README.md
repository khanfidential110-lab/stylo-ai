# STYLO AI - Android App

AI-powered wardrobe management and outfit recommendation app built with Jetpack Compose.

## Features

- Wardrobe digitization with AI clothing detection
- Outfit recommendations based on weather and occasion
- AI chat assistant for style advice
- Multi-item detection from full-body photos
- Native Google Play subscription support

## Requirements

- Android Studio Hedgehog (2023.1.1) or later
- JDK 17
- Android SDK 34
- Kotlin 1.9.20

## Building the APK

### Option 1: Using Android Studio (Recommended)

1. Open Android Studio
2. Select "Open" and navigate to the `android` folder
3. Wait for Gradle sync to complete
4. Go to **Build > Build Bundle(s) / APK(s) > Build APK(s)**
5. The APK will be in `app/build/outputs/apk/debug/`

### Option 2: Using Command Line

```bash
# Navigate to the android directory
cd android

# Build debug APK
./gradlew assembleDebug

# Build release APK (requires signing configuration)
./gradlew assembleRelease
```

The APK files will be generated in:
- Debug: `app/build/outputs/apk/debug/app-debug.apk`
- Release: `app/build/outputs/apk/release/app-release.apk`

### Option 3: GitHub Actions (Automated)

The project includes a GitHub Actions workflow that automatically builds APKs on every push:

1. Push your code to GitHub
2. Go to the **Actions** tab
3. Click on the latest workflow run
4. Download the APK from the **Artifacts** section

## Configuration

### API Base URL

Edit `app/build.gradle.kts` to change the API URL:

```kotlin
buildTypes {
    debug {
        buildConfigField("String", "API_BASE_URL", "\"http://10.0.2.2:3000\"")
    }
    release {
        buildConfigField("String", "API_BASE_URL", "\"https://api.styloai.com\"")
    }
}
```

### Signing for Release

For a signed release APK, add to `app/build.gradle.kts`:

```kotlin
android {
    signingConfigs {
        create("release") {
            storeFile = file("path/to/keystore.jks")
            storePassword = "your_store_password"
            keyAlias = "your_key_alias"
            keyPassword = "your_key_password"
        }
    }

    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
            // ... other config
        }
    }
}
```

## Project Structure

```
android/
├── app/
│   ├── src/main/
│   │   ├── java/com/styloai/app/
│   │   │   ├── data/           # Data layer (models, API, repositories)
│   │   │   ├── di/             # Dependency injection (Hilt modules)
│   │   │   ├── ui/             # UI layer
│   │   │   │   ├── navigation/ # Navigation setup
│   │   │   │   ├── screens/    # Composable screens
│   │   │   │   └── theme/      # Material theme
│   │   │   ├── MainActivity.kt
│   │   │   └── StyloAIApplication.kt
│   │   └── res/                # Resources
│   └── build.gradle.kts
├── gradle/
├── build.gradle.kts
└── settings.gradle.kts
```

## Tech Stack

- **Jetpack Compose** - Modern UI toolkit
- **Material 3** - Design system
- **Hilt** - Dependency injection
- **Retrofit** - HTTP client
- **Coil** - Image loading
- **CameraX** - Camera integration
- **DataStore** - Preferences storage
- **Google Play Billing** - In-app purchases

## License

Copyright 2024 STYLO AI
