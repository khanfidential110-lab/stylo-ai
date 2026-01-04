package com.styloai.app.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.styloai.app.ui.screens.auth.AuthScreen
import com.styloai.app.ui.screens.auth.AuthViewModel
import com.styloai.app.ui.screens.chat.ChatScreen
import com.styloai.app.ui.screens.home.HomeScreen
import com.styloai.app.ui.screens.profile.ProfileScreen
import com.styloai.app.ui.screens.wardrobe.WardrobeScreen

sealed class Screen(
    val route: String,
    val title: String,
    val selectedIcon: ImageVector,
    val unselectedIcon: ImageVector
) {
    data object Home : Screen("home", "Home", Icons.Filled.Home, Icons.Outlined.Home)
    data object Wardrobe : Screen("wardrobe", "Wardrobe", Icons.Filled.Checkroom, Icons.Outlined.Checkroom)
    data object Chat : Screen("chat", "Chat", Icons.Filled.Chat, Icons.Outlined.Chat)
    data object Profile : Screen("profile", "Profile", Icons.Filled.Person, Icons.Outlined.Person)
    data object Auth : Screen("auth", "Auth", Icons.Filled.Lock, Icons.Outlined.Lock)
}

val bottomNavItems = listOf(
    Screen.Home,
    Screen.Wardrobe,
    Screen.Chat,
    Screen.Profile
)

@Composable
fun StyloNavHost() {
    val authViewModel: AuthViewModel = hiltViewModel()
    val isLoggedIn by authViewModel.isLoggedIn.collectAsState(initial = null)

    when (isLoggedIn) {
        null -> {
            // Loading state
            CircularProgressIndicator()
        }
        false -> {
            AuthScreen(viewModel = authViewModel)
        }
        true -> {
            MainNavHost(onLogout = { authViewModel.logout() })
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainNavHost(
    onLogout: () -> Unit
) {
    val navController = rememberNavController()

    Scaffold(
        bottomBar = {
            BottomNavBar(navController = navController)
        }
    ) { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = Screen.Home.route,
            modifier = Modifier.padding(paddingValues)
        ) {
            composable(Screen.Home.route) {
                HomeScreen(
                    onNavigateToWardrobe = {
                        navController.navigate(Screen.Wardrobe.route)
                    },
                    onNavigateToChat = {
                        navController.navigate(Screen.Chat.route)
                    }
                )
            }
            composable(Screen.Wardrobe.route) {
                WardrobeScreen()
            }
            composable(Screen.Chat.route) {
                ChatScreen()
            }
            composable(Screen.Profile.route) {
                ProfileScreen(onLogout = onLogout)
            }
        }
    }
}

@Composable
fun BottomNavBar(navController: NavHostController) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination

    NavigationBar {
        bottomNavItems.forEach { screen ->
            val selected = currentDestination?.hierarchy?.any { it.route == screen.route } == true

            NavigationBarItem(
                icon = {
                    Icon(
                        imageVector = if (selected) screen.selectedIcon else screen.unselectedIcon,
                        contentDescription = screen.title
                    )
                },
                label = { Text(screen.title) },
                selected = selected,
                onClick = {
                    navController.navigate(screen.route) {
                        popUpTo(navController.graph.findStartDestination().id) {
                            saveState = true
                        }
                        launchSingleTop = true
                        restoreState = true
                    }
                }
            )
        }
    }
}
