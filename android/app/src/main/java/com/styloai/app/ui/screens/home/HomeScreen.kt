package com.styloai.app.ui.screens.home

import androidx.compose.animation.*
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage
import com.styloai.app.data.model.*
import java.util.Calendar

@Composable
fun HomeScreen(
    viewModel: HomeViewModel = hiltViewModel(),
    onNavigateToWardrobe: () -> Unit,
    onNavigateToChat: () -> Unit,
    onNavigateToItemDetail: (String) -> Unit,
    onForecastFit: () -> Unit,
    onEventPlanner: () -> Unit,
    onScanItem: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    val error by viewModel.error.collectAsState(initial = null)
    val loading by viewModel.loading.collectAsState()
    
    val snackbarHostState = remember { SnackbarHostState() }
    val scrollState = rememberScrollState()

    LaunchedEffect(error) {
        error?.let {
            snackbarHostState.showSnackbar(it)
        }
    }

    Scaffold(
        containerColor = Color(0xFFF6F6F8),
        snackbarHost = { SnackbarHost(snackbarHostState) }
    ) { padding ->
        Box {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(padding)
                    .verticalScroll(scrollState)
            ) {
                // Header Section
                HomeHeader(user = uiState.user)

                Spacer(modifier = Modifier.height(24.dp))

                // Weather Widget
                uiState.weather?.let { weather ->
                    WeatherWidget(weather)
                }

                Spacer(modifier = Modifier.height(24.dp))

                // Today's Outfit Picks
                SectionHeader(title = "Today's Outfit Picks", action = "See All", onActionClick = onNavigateToWardrobe)
                Spacer(modifier = Modifier.height(12.dp))
                
                if (uiState.recommendations.isNotEmpty()) {
                    LazyRow(
                        contentPadding = PaddingValues(horizontal = 16.dp),
                        horizontalArrangement = Arrangement.spacedBy(16.dp)
                    ) {
                        items(uiState.recommendations) { rec ->
                            OutfitPickCard(rec)
                        }
                    }
                } else {
                     Box(Modifier.fillMaxWidth().padding(horizontal = 16.dp)) {
                        Text("Add items to get style picks!", style = MaterialTheme.typography.bodyMedium, color = Color.Gray)
                     }
                }

                Spacer(modifier = Modifier.height(24.dp))

                // Quick Actions Grid
                Text(
                    text = "Quick Actions",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(horizontal = 16.dp)
                )
                Spacer(modifier = Modifier.height(12.dp))
                QuickActionsGrid(
                    onScanItem = onScanItem,
                    onForecastFit = onForecastFit,
                    onEventPlanner = onEventPlanner,
                    onSurpriseMe = onNavigateToChat
                )

                Spacer(modifier = Modifier.height(24.dp))

                // Wardrobe Insights
                Text(
                    text = "Wardrobe Insights",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    modifier = Modifier.padding(horizontal = 16.dp)
                )
                Spacer(modifier = Modifier.height(12.dp))
                WardrobeInsightCard(uiState.wardrobeStats)

                Spacer(modifier = Modifier.height(24.dp))

                // Recently Worn
                SectionHeader(title = "Recently Worn", action = "See All", onActionClick = onNavigateToWardrobe)
                Spacer(modifier = Modifier.height(12.dp))
                RecentlyWornRow(uiState.recentItems, onNavigateToItemDetail)

                Spacer(modifier = Modifier.height(120.dp)) // Bottom padding
            }

            if (loading) {
                Box(Modifier.fillMaxSize().background(Color.Black.copy(alpha = 0.1f)), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
                }
            }
        }
    }
}

@Composable
fun HomeHeader(user: User?) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 16.dp, start = 16.dp, end = 16.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            // Avatar
            AsyncImage(
                model = user?.avatarUrl ?: "https://lh3.googleusercontent.com/aida-public/AB6AXuC5d4DwxvV47PT4_cuKgwVnf6Luo6ZMlR4xISzTU8i35Oto-jyCZ5StkmZKL9JFEcdrvdKljO8HqmYh2qBIEASMf_r5vUO45ovNA-C8MDvsO1d3KYnLEklm9RNCQN-MonWsxN5DyFSKEsgWO3bw2Du1VNC9tV54eGH4bcA_nyCnNYaqpW642pSXyx02VfMaDjQzjqsGX7Lyymbrx8HzFRSYqVLTB9R9rGxBgYRBP9JtCI63cGdq_zeIfBd8Muq2WQ2cZE2JU_5pneQ",
                contentDescription = null,
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
                    .border(2.dp, Color.White, CircleShape),
                contentScale = ContentScale.Crop
            )
            Spacer(modifier = Modifier.width(12.dp))
            Column {
                Text(
                    text = "Good Morning,",
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color.Gray
                )
                Text(
                    text = user?.name ?: "Alex",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.Bold,
                    color = Color(0xFF111827)
                )
            }
        }
        
        // Notification Icon
        Box(
            modifier = Modifier
                .size(40.dp)
                .background(Color.White, CircleShape)
                .clickable { },
            contentAlignment = Alignment.Center
        ) {
            Icon(Icons.Outlined.Notifications, contentDescription = null, tint = Color.Black)
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .background(Color.Red, CircleShape)
                    .align(Alignment.TopEnd)
                    .offset(x = (-8).dp, y = (8).dp)
            )
        }
    }
}

@Composable
fun WeatherWidget(weather: WeatherData) { // Changed from WeatherInfo
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .clip(RoundedCornerShape(24.dp))
            .background(Color.White)
    ) {
        // Decorative Blob
        Box(
            modifier = Modifier
                .align(Alignment.TopEnd)
                .offset(x = 20.dp, y = (-20).dp)
                .size(120.dp)
                .background(MaterialTheme.colorScheme.primary.copy(alpha=0.1f), CircleShape)
        )

        Column(modifier = Modifier.padding(20.dp)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.Top
            ) {
                Column {
                    Row(verticalAlignment = Alignment.Top) {
                        Text(
                            text = "${weather.temperature.toInt()}°",
                            style = MaterialTheme.typography.displayMedium, // 45sp roughly
                            fontWeight = FontWeight.Bold,
                            color = Color(0xFF111827)
                        )
                    }
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.LocationOn, null, modifier = Modifier.size(16.dp), tint = Color.Gray)
                        Spacer(modifier = Modifier.width(4.dp))
                        Text(weather.city, style = MaterialTheme.typography.bodySmall, color = Color.Gray)
                    }
                }
                
                Column(horizontalAlignment = Alignment.End) {
                    val iconName = WeatherCondition.icon(weather.description)
                    // Simple mapping since we can't reflectively load icons easily in Compose without a map
                    val iconVector = when(iconName) {
                         "wb_sunny" -> Icons.Default.WbSunny
                         "cloud" -> Icons.Default.Cloud
                         "partly_cloudy_day" -> Icons.Default.CloudQueue
                         "rainy" -> Icons.Default.WaterDrop
                         "grain" -> Icons.Default.Grain
                         "thunderstorm" -> Icons.Default.Thunderstorm
                         "ac_unit" -> Icons.Default.AcUnit
                         "foggy" -> Icons.Default.LensBlur
                         "air" -> Icons.Default.Air
                         else -> Icons.Default.WbSunny
                    }

                    Icon(
                        iconVector, 
                        null, 
                        modifier = Modifier.size(40.dp), 
                        tint = Color(0xFFF59E0B) // Yellow-500
                    )
                    Text(weather.description.replaceFirstChar { it.uppercase() }, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.Bold)
                }
            }
            
            Spacer(modifier = Modifier.height(16.dp))
            
            // Insight Pill
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color(0xFFF3F4F6), RoundedCornerShape(12.dp))
                    .padding(12.dp),
                verticalAlignment = Alignment.Top
            ) {
                Icon(Icons.Outlined.Lightbulb, null, modifier = Modifier.size(16.dp), tint = MaterialTheme.colorScheme.primary)
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    WeatherCondition.clothingRecommendation(weather.temperature, weather.description),
                    style = MaterialTheme.typography.bodySmall,
                    color = Color(0xFF4B5563)
                )
            }
        }
    }
}

@Composable
fun OutfitPickCard(rec: OutfitRecommendation) {
    Column(
        modifier = Modifier
            .width(200.dp)
            .background(Color.White, RoundedCornerShape(16.dp))
            .padding(bottom = 12.dp)
    ) {
        val image = rec.outfit.items.firstOrNull()?.imageUrl ?: ""
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(260.dp)
        ) {
            AsyncImage(
                model = image,
                contentDescription = null,
                modifier = Modifier.fillMaxSize().clip(RoundedCornerShape(16.dp)),
                contentScale = ContentScale.Crop
            )
            // Favorite Button
            Box(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(8.dp)
                    .size(32.dp)
                    .background(Color.White.copy(alpha=0.9f), CircleShape)
                    .clickable {},
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.FavoriteBorder, null, modifier = Modifier.size(20.dp))
            }
        }
        
        Column(modifier = Modifier.padding(12.dp)) {
            Text(rec.outfit.name ?: "Stylish Look", fontWeight = FontWeight.Bold)
            Text(
                "Blazer • White Tee • Jeans", 
                style = MaterialTheme.typography.bodySmall, 
                color = Color.Gray
            )
            Spacer(modifier = Modifier.height(8.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Icon(Icons.Default.AutoAwesome, null, modifier = Modifier.size(14.dp), tint = Color(0xFF16A34A))
                Spacer(modifier = Modifier.width(4.dp))
                Text("98% Match", style = MaterialTheme.typography.bodySmall, color = Color(0xFF16A34A), fontWeight = FontWeight.Medium)
            }
        }
    }
}

@Composable
fun QuickActionsGrid(
    onScanItem: () -> Unit,
    onForecastFit: () -> Unit,
    onEventPlanner: () -> Unit,
    onSurpriseMe: () -> Unit
) {
    Column(modifier = Modifier.padding(horizontal = 16.dp)) {
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            QuickActionButton(
                icon = Icons.Outlined.PhotoCamera,
                label = "Scan Item",
                modifier = Modifier.weight(1f),
                onClick = onScanItem
            )
            QuickActionButton(
                icon = Icons.Outlined.Cloud,
                label = "Forecast Fit",
                modifier = Modifier.weight(1f),
                onClick = onForecastFit
            )
        }
        Spacer(modifier = Modifier.height(12.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            QuickActionButton(
                icon = Icons.Outlined.CalendarMonth,
                label = "Event Planning",
                modifier = Modifier.weight(1f),
                onClick = onEventPlanner
            )
            QuickActionButton(
                icon = Icons.Default.AutoAwesome,
                label = "Surprise Me",
                modifier = Modifier.weight(1f),
                isPrimary = true,
                onClick = onSurpriseMe
            )
        }
    }
}

@Composable
fun QuickActionButton(
    icon: Any,
    label: String,
    modifier: Modifier = Modifier,
    isPrimary: Boolean = false,
    onClick: () -> Unit
) {
    val containerColor = if (isPrimary) MaterialTheme.colorScheme.primary else Color.White
    val contentColor = if (isPrimary) Color.White else Color.Black
    val iconBg = if (isPrimary) Color.White.copy(alpha=0.2f) else Color(0xFFF3F4F6)
    val iconTint = if (isPrimary) Color.White else Color.Black

    Column(
        modifier = modifier
            .clip(RoundedCornerShape(16.dp))
            .background(containerColor)
            .clickable(onClick = onClick)
            .padding(vertical = 24.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Box(
            modifier = Modifier
                .size(48.dp)
                .background(iconBg, CircleShape),
            contentAlignment = Alignment.Center
        ) { 
            if (icon is androidx.compose.ui.graphics.vector.ImageVector) {
                Icon(icon, null, tint = iconTint, modifier = Modifier.size(28.dp))
            }
        }
        Spacer(modifier = Modifier.height(8.dp))
        Text(label, style = MaterialTheme.typography.titleSmall, fontWeight = FontWeight.SemiBold, color = contentColor)
    }
}

@Composable
fun WardrobeInsightCard(stats: WardrobeStats?) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
            .clip(RoundedCornerShape(16.dp))
            .background(Color.White)
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Thumbnail
        Box(
            modifier = Modifier
                .size(64.dp)
                .clip(RoundedCornerShape(8.dp))
                .background(Color(0xFFEEF2FF)),
            contentAlignment = Alignment.Center
        ) {
            Icon(Icons.Default.Insights, null, tint = Color(0xFF3B3FF1))
        }
        
        Spacer(modifier = Modifier.width(16.dp))
        
        Column(modifier = Modifier.weight(1f)) {
            Text(if (stats != null) "Wardrobe Snapshot" else "Neglected Item Alert", fontWeight = FontWeight.Medium)
            Text(
                stats?.let { "You have ${it.totalItems} items in your wardrobe." } ?: "You haven't worn your Blue Denim Jacket in 3 months.",
                style = MaterialTheme.typography.bodySmall,
                color = Color.Gray
            )
        }
        
        IconButton(
            onClick = {},
            modifier = Modifier.background(Color(0xFFF3F4F6), CircleShape).size(32.dp)
        ) {
            Icon(Icons.Default.ChevronRight, null, tint = Color.Gray)
        }
    }
}

@Composable
fun RecentlyWornRow(
    items: List<WardrobeItem>,
    onItemClick: (String) -> Unit = {}
) {
    if (items.isEmpty()) {
        Box(Modifier.fillMaxWidth().padding(16.dp), contentAlignment = Alignment.Center) {
            Text("No items worn recently", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
        }
        return
    }

    LazyRow(
        contentPadding = PaddingValues(horizontal = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(items) { item ->
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier
                    .width(80.dp)
                    .clickable { onItemClick(item.id) }
            ) {
                 Box(
                    modifier = Modifier
                        .size(80.dp)
                        .clip(RoundedCornerShape(12.dp))
                        .background(Color.White)
                        .padding(4.dp)
                ) {
                    AsyncImage(
                        model = item.imageUrl,
                        contentDescription = null,
                        modifier = Modifier.fillMaxSize().clip(RoundedCornerShape(8.dp)),
                        contentScale = ContentScale.Crop
                    )
                }
                Spacer(modifier = Modifier.height(4.dp))
                Text(item.name ?: "Item", style = MaterialTheme.typography.bodySmall, color = Color.Gray, maxLines = 1)
            }
        }
    }
}

@Composable
fun SectionHeader(title: String, action: String?, onActionClick: () -> Unit = {}) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(title, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
        if (action != null) {
            Text(
                action, 
                style = MaterialTheme.typography.bodySmall, 
                fontWeight = FontWeight.Bold, 
                color = MaterialTheme.colorScheme.primary,
                modifier = Modifier.clickable(onClick = onActionClick)
            )
        }
    }
}
