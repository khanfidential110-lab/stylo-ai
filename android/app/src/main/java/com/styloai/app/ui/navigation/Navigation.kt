package com.styloai.app.ui.navigation

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.styloai.app.ui.components.GlassBottomNavigation
import com.styloai.app.ui.screens.OnboardingScreen
import com.styloai.app.ui.screens.WelcomeScreen
import com.styloai.app.ui.screens.PermissionsScreen
import com.styloai.app.ui.screens.InitialWardrobeScreen
import com.styloai.app.ui.screens.auth.AuthScreen
import com.styloai.app.ui.screens.auth.AuthViewModel
import com.styloai.app.ui.screens.camera.CameraScreen
import com.styloai.app.ui.screens.chat.ChatScreen
import com.styloai.app.ui.screens.home.HomeScreen
import com.styloai.app.ui.screens.profile.ProfileScreen
import com.styloai.app.ui.screens.wardrobe.WardrobeScreen
import com.styloai.app.ui.screens.wardrobe.ItemEditScreen
import com.styloai.app.ui.screens.wardrobe.ItemDetailScreen
import com.styloai.app.ui.screens.calendar.CalendarScreen
import com.styloai.app.ui.screens.outfits.OutfitScreen
import com.styloai.app.ui.screens.outfits.OutfitDetailScreen
import com.styloai.app.ui.screens.outfits.RecommendationScreen
import androidx.navigation.NamedNavArgument
import androidx.navigation.NavType
import androidx.navigation.navArgument
import android.net.Uri

sealed class Screen(val route: String) {
    object Onboarding : Screen("onboarding")
    object Auth : Screen("auth")
    object Home : Screen("home")
    object Wardrobe : Screen("wardrobe")
    object Calendar : Screen("calendar")
    object Camera : Screen("camera")
    object ItemEdit : Screen("item_edit/{imageUri}") {
        fun createRoute(imageUri: String) = "item_edit/${Uri.encode(imageUri)}"
    }
    object Chat : Screen("chat")
    object Profile : Screen("profile")
    object Welcome : Screen("welcome")
    object Permissions : Screen("permissions")
    object InitialWardrobe : Screen("initial_wardrobe")
    object ItemDetail : Screen("item_detail/{itemId}") {
        fun createRoute(itemId: String) = "item_detail/$itemId"
    }
    object Outfits : Screen("outfits")
    object OutfitDetail : Screen("outfit_detail/{outfitId}") {
        fun createRoute(outfitId: String) = "outfit_detail/$outfitId"
    }
    object Recommendation : Screen("recommendation") {
         fun createRoute(occasion: String? = null) = if (occasion != null) "recommendation?occasion=$occasion" else "recommendation"
    }
}

@Composable
fun StyloNavHost() {
    val authViewModel: AuthViewModel = hiltViewModel()
    val isLoggedIn by authViewModel.isLoggedIn.collectAsState(initial = null)
    val isOnboardingCompleted by authViewModel.isOnboardingCompleted.collectAsState(initial = null)

    if (isLoggedIn == null || isOnboardingCompleted == null) {
        // Loading state
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
        }
    } else {
        MainNavHost(
            startDestination = if (!isOnboardingCompleted!!) {
                Screen.Welcome.route
            } else if (!isLoggedIn!!) {
                Screen.Auth.route
            } else {
                Screen.Home.route
            },
            onLogout = { authViewModel.logout() },
            onOnboardingComplete = { authViewModel.completeOnboarding() }
        )
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainNavHost(
    startDestination: String,
    onLogout: () -> Unit,
    onOnboardingComplete: () -> Unit
) {
    val navController = rememberNavController()
    val currentRoute = navController.currentBackStackEntryAsState().value?.destination?.route
    
    val showBottomBar = currentRoute in listOf(
        Screen.Home.route,
        Screen.Wardrobe.route,
        Screen.Calendar.route,
        Screen.Chat.route,
        Screen.Outfits.route,
        Screen.Profile.route
    )

    Scaffold(
        bottomBar = {
            if (showBottomBar) {
                GlassBottomNavigation(
                    navController = navController,
                    onScanClick = { navController.navigate(Screen.Camera.route) }
                )
            }
        }
    ) { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = startDestination,
            modifier = Modifier.padding(paddingValues)
        ) {
            composable(Screen.Auth.route) {
                AuthScreen(
                    onLoginSuccess = {
                        onOnboardingComplete()
                        navController.navigate(Screen.Permissions.route) {
                            popUpTo(Screen.Auth.route) { inclusive = true }
                        }
                    }
                )
            }
            composable(Screen.Welcome.route) {
                WelcomeScreen(
                    onGetStarted = { navController.navigate(Screen.Onboarding.route) },
                    onLogin = { navController.navigate(Screen.Auth.route) }
                )
            }
            composable(Screen.Onboarding.route) {
                OnboardingScreen(
                    onComplete = { navController.navigate(Screen.Auth.route) },
                    onSkip = { navController.navigate(Screen.Auth.route) }
                )
            }
            composable(Screen.Permissions.route) {
                PermissionsScreen(
                    onGrant = { navController.navigate(Screen.InitialWardrobe.route) },
                    onSkip = { navController.navigate(Screen.Home.route) }
                )
            }
            composable(Screen.InitialWardrobe.route) {
                InitialWardrobeScreen(
                    onStartDigitizing = { navController.navigate(Screen.Camera.route) },
                    onExploreLater = { navController.navigate(Screen.Home.route) }
                )
            }
            composable(Screen.Home.route) {
                HomeScreen(
                    onNavigateToWardrobe = { navController.navigate(Screen.Wardrobe.route) },
                    onNavigateToChat = { navController.navigate(Screen.Chat.route) },
                    onNavigateToItemDetail = { itemId -> 
                        navController.navigate(Screen.ItemDetail.createRoute(itemId))
                    },
                    onForecastFit = {
                        navController.navigate(Screen.Recommendation.createRoute())
                    },
                    onEventPlanner = {
                        navController.navigate(Screen.Calendar.route)
                    },
                    onScanItem = {
                        navController.navigate(Screen.Camera.route)
                    }
                )
            }
            composable(Screen.Wardrobe.route) {
                WardrobeScreen(
                    onNavigateToCamera = { navController.navigate(Screen.Camera.route) },
                    onNavigateToItemDetail = { itemId ->
                        navController.navigate(Screen.ItemDetail.createRoute(itemId))
                    },
                    onNavigateToItemEdit = { imageUri ->
                        navController.navigate(Screen.ItemEdit.createRoute(imageUri))
                    }
                )
            }
            composable(Screen.Calendar.route) {
                CalendarScreen(
                    onBack = { navController.popBackStack() },
                    onPlanOutfit = { navController.navigate(Screen.Recommendation.route) }
                )
            }
            composable(Screen.Camera.route) { // "Scan"
                CameraScreen(
                    onImageCaptured = { uriString ->
                        navController.navigate(Screen.ItemEdit.createRoute(uriString))
                    },
                    onClose = { navController.popBackStack() }
                )
            }
            composable(
                route = Screen.ItemDetail.route,
                arguments = listOf(navArgument("itemId") { type = NavType.StringType })
            ) { backStackEntry ->
                val itemId = backStackEntry.arguments?.getString("itemId") ?: ""
                ItemDetailScreen(
                    itemId = itemId,
                    onBack = { navController.popBackStack() },
                    onEdit = { /* Navigate to edit */ }
                )
            }
            composable(
                route = Screen.ItemEdit.route,
                arguments = listOf(navArgument("imageUri") { type = NavType.StringType })
        ) { backStackEntry ->
            val imageUri = backStackEntry.arguments?.getString("imageUri") ?: ""
            ItemEditScreen(
                imageUri = imageUri,
                onBack = { navController.popBackStack() },
                onSaveSuccess = {
                    navController.popBackStack(Screen.Wardrobe.route, false)
                }
            )
        }
            composable(Screen.Chat.route) {
                ChatScreen(onNavigateBack = { navController.popBackStack() })
            }
            composable(Screen.Outfits.route) {
                OutfitScreen(
                    onNavigateToOutfitDetail = { outfitId ->
                        navController.navigate(Screen.OutfitDetail.createRoute(outfitId))
                    },
                    onNavigateToCreateOutfit = {
                        // navController.navigate(Screen.CreateOutfit.route)
                    }
                )
            }
            composable(
                route = Screen.OutfitDetail.route,
                arguments = listOf(navArgument("outfitId") { type = NavType.StringType })
            ) { backStackEntry ->
                val outfitId = backStackEntry.arguments?.getString("outfitId") ?: ""
                OutfitDetailScreen(
                    outfitId = outfitId,
                    onBack = { navController.popBackStack() }
                )
            }
            composable(
                route = Screen.Recommendation.route + "?occasion={occasion}",
                arguments = listOf(navArgument("occasion") { 
                    type = NavType.StringType
                    nullable = true 
                    defaultValue = null
                })
            ) { backStackEntry ->
                val occasion = backStackEntry.arguments?.getString("occasion")
                RecommendationScreen(
                    occasion = occasion,
                    onBack = { navController.popBackStack() },
                    onNavigateToOutfitDetail = { outfitId ->
                        navController.navigate(Screen.OutfitDetail.createRoute(outfitId))
                    }
                )
            }
            composable(Screen.Profile.route) {
                ProfileScreen(
                    onLogout = {
                        onLogout()
                        navController.navigate(Screen.Auth.route) {
                            popUpTo(0)
                        }
                    }
                )
            }
        }
    }
}
