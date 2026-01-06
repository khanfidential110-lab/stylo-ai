package com.styloai.app.ui.screens.wardrobe

import android.Manifest
import android.content.pm.PackageManager
import android.graphics.Bitmap
import android.net.Uri
import android.widget.Toast
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.PickVisualMediaRequest
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.staggeredgrid.LazyVerticalStaggeredGrid
import androidx.compose.foundation.lazy.staggeredgrid.StaggeredGridCells
import androidx.compose.foundation.lazy.staggeredgrid.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Brush
import androidx.compose.foundation.BorderStroke
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.core.content.ContextCompat
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage
import com.styloai.app.data.model.ClothingCategory
import com.styloai.app.data.model.WardrobeItem
import com.styloai.app.ui.components.StyloCard
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.outlined.HelpOutline
import androidx.compose.material.icons.outlined.CameraAlt
import androidx.compose.material.icons.outlined.PhotoLibrary
import androidx.compose.material.icons.outlined.Edit
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.ui.text.style.TextAlign
import java.io.File
import java.io.FileOutputStream
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WardrobeScreen(
    viewModel: WardrobeViewModel = hiltViewModel(),
    onNavigateToCamera: () -> Unit = {},
    onNavigateToItemDetail: (String) -> Unit = {},
    onNavigateToItemEdit: (String) -> Unit = {}
) {
    val uiState by viewModel.uiState.collectAsState()
    val error by viewModel.error.collectAsState(initial = null)
    val loading by viewModel.loading.collectAsState()
    
    val snackbarHostState = remember { SnackbarHostState() }
    val scrollBehavior = TopAppBarDefaults.enterAlwaysScrollBehavior()
    val scope = rememberCoroutineScope()

    LaunchedEffect(error) {
        error?.let {
            snackbarHostState.showSnackbar(it)
        }
    }

    Scaffold(
        containerColor = Color(0xFFF6F6F8),
        snackbarHost = { SnackbarHost(snackbarHostState) },
        topBar = {
            Column(
                modifier = Modifier
                    .background(Color(0xFFF6F6F8).copy(alpha = 0.95f))
                    .padding(bottom = 8.dp)
            ) {
                 // 1. Top Bar (Title + Icons)
                Row(
                   modifier = Modifier
                       .fillMaxWidth()
                       .padding(horizontal = 16.dp, vertical = 12.dp),
                   verticalAlignment = Alignment.CenterVertically,
                   horizontalArrangement = Arrangement.SpaceBetween
               ) {
                   Text(
                       "My Wardrobe",
                       style = MaterialTheme.typography.headlineSmall,
                       fontWeight = FontWeight.Bold,
                       color = Color.Black
                   )
                   Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                       IconButton(onClick = { scope.launch { snackbarHostState.showSnackbar("Sort coming soon!") } }, modifier = Modifier.size(40.dp)) {
                           Icon(Icons.Default.Sort, null, tint = Color.Gray)
                       }
                       IconButton(onClick = { scope.launch { snackbarHostState.showSnackbar("View toggle coming soon!") } }, modifier = Modifier.size(40.dp)) {
                           Icon(Icons.Default.GridView, null, tint = Color.Gray)
                       }
                   }
               }
               
               // 2. Search Bar
               Box(modifier = Modifier.padding(horizontal = 16.dp)) {
                   TextField(
                       value = uiState.searchQuery,
                       onValueChange = viewModel::updateSearchQuery,
                       placeholder = { Text("Search for 'Blue denim jacket'...", style = MaterialTheme.typography.bodyMedium, color = Color.Gray) },
                       leadingIcon = { Icon(Icons.Default.Search, null, tint = Color.Gray) },
                       trailingIcon = if (uiState.searchQuery.isNotEmpty()) {
                           { IconButton(onClick = { viewModel.updateSearchQuery("") }) { Icon(Icons.Default.Close, null, tint = Color.Gray) } }
                       } else {
                           { Icon(Icons.Default.Tune, null, tint = Color.Gray) }
                       },
                       modifier = Modifier
                           .fillMaxWidth()
                           .shadow(2.dp, RoundedCornerShape(12.dp))
                           .background(Color.White, RoundedCornerShape(12.dp)),
                        colors = TextFieldDefaults.colors(
                            focusedContainerColor = Color.White,
                            unfocusedContainerColor = Color.White,
                            focusedIndicatorColor = Color.Transparent,
                            unfocusedIndicatorColor = Color.Transparent
                        ),
                        singleLine = true
                   )
               }
               
               Spacer(modifier = Modifier.height(12.dp))
               
               // 3. Filter Chips
                LazyRow(
                    contentPadding = PaddingValues(horizontal = 16.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    item {
                        FilterChip(
                            selected = uiState.selectedCategory == null,
                            onClick = { viewModel.selectCategory(null) },
                            label = { Text("All", color = if (uiState.selectedCategory == null) Color.White else Color.Gray) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = MaterialTheme.colorScheme.primary,
                                containerColor = Color.White
                            ),
                            shape = CircleShape,
                            border = if (uiState.selectedCategory == null) null else FilterChipDefaults.filterChipBorder(borderColor = Color.LightGray, selectedBorderColor = Color.Transparent, disabledBorderColor = Color.LightGray, disabledSelectedBorderColor = Color.Transparent),
                            modifier = Modifier.height(36.dp)
                        )
                    }
                    items(uiState.categories) { category ->
                        FilterChip(
                            selected = uiState.selectedCategory == category,
                            onClick = { viewModel.selectCategory(category) },
                            label = { Text(ClothingCategory.displayName(category), color = if (uiState.selectedCategory == category) Color.White else Color.Gray) },
                            colors = FilterChipDefaults.filterChipColors(
                                selectedContainerColor = MaterialTheme.colorScheme.primary,
                                containerColor = Color.White
                            ),
                            shape = CircleShape,
                            border = if (uiState.selectedCategory == category) null else FilterChipDefaults.filterChipBorder(
                                borderColor = Color.LightGray,
                                selectedBorderColor = Color.Transparent,
                                disabledBorderColor = Color.LightGray,
                                disabledSelectedBorderColor = Color.Transparent
                            ),
                             modifier = Modifier.height(36.dp)
                        )
                    }
                }
            }
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { viewModel.showAddItem() },
                containerColor = MaterialTheme.colorScheme.primary,
                contentColor = Color.White,
                shape = CircleShape,
                modifier = Modifier.padding(bottom = 90.dp)
            ) {
                Icon(Icons.Default.Add, null)
            }
        }
    ) { paddingValues ->
        Box(modifier = Modifier.padding(paddingValues)) {
            // Grid Area
            val filteredItems = if (uiState.searchQuery.isEmpty()) {
                uiState.items
            } else {
                uiState.items.filter { 
                    (it.name ?: "").contains(uiState.searchQuery, ignoreCase = true) || 
                    it.category.contains(uiState.searchQuery, ignoreCase = true) ||
                    (it.primaryColor ?: "").contains(uiState.searchQuery, ignoreCase = true)
                }
            }
            
            if (filteredItems.isEmpty() && !loading) {
                EmptyWardrobeState { viewModel.showAddItem() }
            } else {
                LazyVerticalStaggeredGrid(
                    columns = StaggeredGridCells.Fixed(2),
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(horizontal = 16.dp),
                    contentPadding = PaddingValues(top = 16.dp, bottom = 100.dp),
                    horizontalArrangement = Arrangement.spacedBy(16.dp),
                    verticalItemSpacing = 16.dp
                ) {
                    items(filteredItems) { item ->
                        WardrobeGridItem(
                            item = item,
                            onFavoriteClick = { viewModel.toggleFavorite(item) },
                            onItemClick = { onNavigateToItemDetail(item.id) }
                        )
                    }
                }
            }
            
            if (loading) {
                Box(Modifier.fillMaxSize().background(Color.Black.copy(alpha = 0.05f)), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
                }
            }

            if (uiState.showAddItem) {
                ModalBottomSheet(
                    onDismissRequest = viewModel::hideAddItem,
                    containerColor = Color(0xFFF6F6F8)
                ) {
                    AddItemSheet(
                        isProcessing = uiState.isProcessing,
                        onDismiss = viewModel::hideAddItem,
                        onNavigateToCamera = onNavigateToCamera,
                        onNavigateToItemEdit = onNavigateToItemEdit,
                        onImageSelected = { uri ->
                            viewModel.setSelectedImage(uri)
                            viewModel.hideAddItem()
                            onNavigateToItemEdit(uri.toString())
                        }
                    )
                }
            }
        }
    }
}

@Composable
fun WardrobeGridItem(
    item: WardrobeItem,
    onFavoriteClick: () -> Unit,
    onItemClick: () -> Unit
) {
    Column(
        modifier = Modifier.clickable(onClick = onItemClick)
    ) {
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .aspectRatio(0.75f) // 3:4 Aspect Ratio
                .clip(RoundedCornerShape(16.dp))
                .background(Color.White)
        ) {
            AsyncImage(
                model = item.imageUrl,
                contentDescription = null,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
            
            // Favorite (Top Right)
            Box(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(8.dp)
                    .size(28.dp)
                    .background(Color.White.copy(alpha=0.8f), CircleShape)
                    .clickable(onClick = onFavoriteClick),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    imageVector = if (item.isFavorite) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                    contentDescription = null,
                    tint = if (item.isFavorite) Color.Red else Color.Gray,
                    modifier = Modifier.size(16.dp)
                )
            }
        }
        
        Spacer(modifier = Modifier.height(8.dp))
        
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.Top
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = ClothingCategory.displayName(item.category),
                    style = MaterialTheme.typography.labelLarge,
                    fontWeight = FontWeight.SemiBold,
                    color = Color.Black
                )
                Text(
                    text = "Winter Collection", // Placeholder/Mock
                    style = MaterialTheme.typography.bodySmall,
                    color = Color.Gray
                )
            }
            // Color Dot
            Box(
                modifier = Modifier
                    .size(16.dp)
                    .background(Color(0xFFE5D0B1), CircleShape) // Mock Color
                    .border(1.dp, Color.LightGray, CircleShape)
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddItemSheet(
    isProcessing: Boolean,
    onDismiss: () -> Unit,
    onNavigateToCamera: () -> Unit,
    onNavigateToItemEdit: (String) -> Unit,
    onImageSelected: (android.net.Uri) -> Unit
) {
    val context = LocalContext.current
    val galleryLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.PickVisualMedia()
    ) { uri: Uri? ->
        if (uri != null) {
             onImageSelected(uri)
        }
    }

    ModalBottomSheet(
        onDismissRequest = onDismiss,
        containerColor = Color(0xFFF6F6F8) // Light Background
    ) {
        Column(
            modifier = Modifier
                .padding(24.dp)
                .padding(bottom = 32.dp),
            horizontalAlignment = Alignment.Start
        ) {
            // Header
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        "Add New Item",
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold,
                        color = Color.Black
                    )
                    Text(
                        "Build your digital wardrobe",
                        style = MaterialTheme.typography.bodySmall,
                        color = Color.Gray
                    )
                }
                IconButton(
                    onClick = onDismiss,
                    modifier = Modifier
                        .size(40.dp)
                        .background(Color.White, CircleShape)
                        .border(1.dp, Color(0xFFF0F0F4), CircleShape)
                ) {
                    Icon(Icons.Default.Close, null, tint = Color.Black)
                }
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            // AI Analysis Banner
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(16.dp))
                    .background(
                        Brush.horizontalGradient(
                            colors = listOf(
                                Color(0xFF3B3FF1).copy(alpha = 0.1f),
                                Color(0xFFA855F7).copy(alpha = 0.1f)
                            )
                        )
                    )
                    .border(1.dp, Color(0xFF3B3FF1).copy(alpha = 0.1f), RoundedCornerShape(16.dp))
                    .padding(16.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    Icons.Default.AutoAwesome,
                    null,
                    tint = Color(0xFF3B3FF1),
                    modifier = Modifier.padding(end = 12.dp)
                )
                Column {
                    Text(
                        "AI Analysis Ready",
                        style = MaterialTheme.typography.labelLarge,
                        fontWeight = FontWeight.SemiBold,
                        color = Color.Black
                    )
                    Text(
                        "Stylo AI can automatically detect color, pattern, and category from your photos.",
                        style = MaterialTheme.typography.bodySmall,
                        color = Color.Gray
                    )
                }
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            Text(
                "SELECT METHOD",
                style = MaterialTheme.typography.labelSmall,
                fontWeight = FontWeight.Bold,
                color = Color.Black,
                modifier = Modifier.padding(bottom = 16.dp)
            )
            
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                // Camera Option
                MethodSelectionCard(
                    title = "Take a Photo",
                    subtitle = "Use camera to capture item",
                    icon = Icons.Outlined.CameraAlt,
                    iconTint = Color(0xFF3B3FF1),
                    iconBg = Color(0xFFEFF6FF), // Blue-50
                    onClick = {
                        onNavigateToCamera()
                        onDismiss()
                    }
                )

                // Gallery Option
                MethodSelectionCard(
                    title = "Upload from Gallery",
                    subtitle = "Select from existing photos",
                    icon = Icons.Outlined.PhotoLibrary,
                    iconTint = Color(0xFFA855F7), // Purple-600
                    iconBg = Color(0xFFFAF5FF), // Purple-50
                    onClick = { galleryLauncher.launch(PickVisualMediaRequest(ActivityResultContracts.PickVisualMedia.ImageOnly)) }
                )

                // Manual Option
                MethodSelectionCard(
                    title = "Enter Manually",
                    subtitle = "Add without a photo",
                    icon = Icons.Outlined.Edit,
                    iconTint = Color(0xFFEA580C), // Orange-600
                    iconBg = Color(0xFFFFF7ED), // Orange-50
                    onClick = {
                        onNavigateToItemEdit("manual")
                        onDismiss()
                    }
                )
            }

            if (isProcessing) {
                Spacer(modifier = Modifier.height(24.dp))
                Box(Modifier.fillMaxWidth(), contentAlignment = Alignment.Center) {
                    CircularProgressIndicator(color = Color(0xFF3B3FF1))
                }
                Text("Analyzing...", modifier = Modifier.fillMaxWidth(), textAlign = TextAlign.Center, color = Color.Gray)
            }
            
            Spacer(modifier = Modifier.height(24.dp))
            
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.Center,
                verticalAlignment = Alignment.CenterVertically
            ) {
                 Icon(Icons.Outlined.HelpOutline, null, tint = Color.Gray, modifier = Modifier.size(16.dp))
                 Spacer(modifier = Modifier.width(4.dp))
                 Text("Need help with adding items?", style = MaterialTheme.typography.labelSmall, color = Color.Gray)
            }
        }
    }
}

@Composable
fun MethodSelectionCard(
    title: String,
    subtitle: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    iconTint: Color,
    iconBg: Color,
    onClick: () -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(16.dp))
            .background(Color.White)
            .border(1.dp, Color(0xFFE5E7EB), RoundedCornerShape(16.dp)) // Gray-200
            .clickable(onClick = onClick)
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(56.dp)
                .background(iconBg, RoundedCornerShape(12.dp)),
            contentAlignment = Alignment.Center
        ) {
            Icon(icon, null, tint = iconTint, modifier = Modifier.size(28.dp))
        }
        
        Spacer(modifier = Modifier.width(16.dp))
        
        Column(modifier = Modifier.weight(1f)) {
            Text(title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold, color = Color.Black)
            Text(subtitle, style = MaterialTheme.typography.bodySmall, color = Color.Gray)
        }
        
        Box(
            modifier = Modifier
                .size(32.dp)
                .background(Color(0xFFF9FAFB), CircleShape), // Gray-50
            contentAlignment = Alignment.Center
        ) {
            Icon(Icons.Default.ArrowForward, null, tint = Color.Gray, modifier = Modifier.size(16.dp))
        }
    }
}

@Composable
fun EmptyWardrobeState(onAdd: () -> Unit) {
    Box(
        modifier = Modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Icon(
                Icons.Outlined.Checkroom,
                contentDescription = null,
                modifier = Modifier.size(64.dp),
                tint = MaterialTheme.colorScheme.surfaceVariant
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text("No items yet", style = MaterialTheme.typography.titleMedium, color = Color.Gray)
            Button(onClick = onAdd, modifier = Modifier.padding(top = 16.dp)) {
                Text("Add First Item")
            }
        }
    }
}
