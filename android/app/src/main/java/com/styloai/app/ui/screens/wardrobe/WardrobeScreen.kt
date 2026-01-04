package com.styloai.app.ui.screens.wardrobe

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage
import com.styloai.app.data.model.ClothingCategory
import com.styloai.app.data.model.WardrobeItem
import com.styloai.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun WardrobeScreen(
    viewModel: WardrobeViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    // Error dialog
    if (uiState.error != null) {
        AlertDialog(
            onDismissRequest = { viewModel.clearError() },
            title = { Text("Error") },
            text = { Text(uiState.error!!) },
            confirmButton = {
                TextButton(onClick = { viewModel.clearError() }) {
                    Text("OK")
                }
            }
        )
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Wardrobe") },
                actions = {
                    IconButton(onClick = { viewModel.loadItems() }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Refresh")
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { viewModel.showAddItem() },
                containerColor = BrandIndigo
            ) {
                Icon(Icons.Default.Add, contentDescription = "Add Item", tint = Color.White)
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Stats summary
            uiState.stats?.let { stats ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(16.dp)
                ) {
                    Row(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(16.dp),
                        horizontalArrangement = Arrangement.SpaceEvenly
                    ) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = stats.totalItems.toString(),
                                style = MaterialTheme.typography.headlineSmall,
                                fontWeight = FontWeight.Bold,
                                color = BrandIndigo
                            )
                            Text(
                                text = "Total",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text(
                                text = stats.favorites.size.toString(),
                                style = MaterialTheme.typography.headlineSmall,
                                fontWeight = FontWeight.Bold,
                                color = AccentAmber
                            )
                            Text(
                                text = "Favorites",
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }

            // Category filter
            LazyRow(
                contentPadding = PaddingValues(horizontal = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                item {
                    FilterChip(
                        selected = uiState.selectedCategory == null,
                        onClick = { viewModel.selectCategory(null) },
                        label = { Text("All") }
                    )
                }
                items(uiState.categories) { category ->
                    FilterChip(
                        selected = uiState.selectedCategory == category,
                        onClick = { viewModel.selectCategory(category) },
                        label = { Text(ClothingCategory.displayName(category)) }
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Items grid
            if (uiState.isLoading) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    CircularProgressIndicator()
                }
            } else if (uiState.items.isEmpty()) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(
                            Icons.Default.Checkroom,
                            contentDescription = null,
                            modifier = Modifier.size(64.dp),
                            tint = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "No items yet",
                            style = MaterialTheme.typography.titleMedium
                        )
                        Text(
                            text = "Add your first clothing item",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            } else {
                LazyVerticalGrid(
                    columns = GridCells.Fixed(2),
                    contentPadding = PaddingValues(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(uiState.items) { item ->
                        WardrobeItemCard(
                            item = item,
                            onFavoriteClick = { viewModel.toggleFavorite(item) },
                            onDeleteClick = { viewModel.deleteItem(item) }
                        )
                    }
                }
            }
        }

        // Add item bottom sheet
        if (uiState.showAddItem) {
            AddItemBottomSheet(
                captureMode = uiState.captureMode,
                onCaptureModeChange = { viewModel.setCaptureMode(it) },
                isProcessing = uiState.isProcessing,
                detectedItems = uiState.detectedItems,
                onToggleDetectedItem = { viewModel.toggleDetectedItemSelection(it) },
                onDismiss = { viewModel.hideAddItem() }
            )
        }
    }
}

@Composable
fun WardrobeItemCard(
    item: WardrobeItem,
    onFavoriteClick: () -> Unit,
    onDeleteClick: () -> Unit
) {
    var showMenu by remember { mutableStateOf(false) }

    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Box {
            Column {
                AsyncImage(
                    model = item.imageUrl,
                    contentDescription = item.name,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(150.dp),
                    contentScale = ContentScale.Crop
                )
                Column(
                    modifier = Modifier.padding(12.dp)
                ) {
                    Text(
                        text = item.name ?: ClothingCategory.displayName(item.category),
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Medium,
                        maxLines = 1
                    )
                    Spacer(modifier = Modifier.height(4.dp))
                    Row(
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        item.primaryColor?.let { color ->
                            Box(
                                modifier = Modifier
                                    .size(16.dp)
                                    .clip(CircleShape)
                                    .background(ClothingColors.colorFor(color))
                            )
                        }
                        Text(
                            text = ClothingCategory.displayName(item.category),
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            // Favorite and menu buttons
            Row(
                modifier = Modifier
                    .align(Alignment.TopEnd)
                    .padding(4.dp)
            ) {
                IconButton(
                    onClick = onFavoriteClick,
                    modifier = Modifier
                        .size(32.dp)
                        .clip(CircleShape)
                        .background(Color.White.copy(alpha = 0.8f))
                ) {
                    Icon(
                        imageVector = if (item.isFavorite) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                        contentDescription = "Favorite",
                        tint = if (item.isFavorite) ErrorRed else Gray500,
                        modifier = Modifier.size(16.dp)
                    )
                }
                Box {
                    IconButton(
                        onClick = { showMenu = true },
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(Color.White.copy(alpha = 0.8f))
                    ) {
                        Icon(
                            Icons.Default.MoreVert,
                            contentDescription = "More",
                            modifier = Modifier.size(16.dp)
                        )
                    }
                    DropdownMenu(
                        expanded = showMenu,
                        onDismissRequest = { showMenu = false }
                    ) {
                        DropdownMenuItem(
                            text = { Text("Delete") },
                            onClick = {
                                showMenu = false
                                onDeleteClick()
                            },
                            leadingIcon = {
                                Icon(Icons.Default.Delete, contentDescription = null)
                            }
                        )
                    }
                }
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AddItemBottomSheet(
    captureMode: CaptureMode,
    onCaptureModeChange: (CaptureMode) -> Unit,
    isProcessing: Boolean,
    detectedItems: List<com.styloai.app.data.model.DetectedItem>,
    onToggleDetectedItem: (Int) -> Unit,
    onDismiss: () -> Unit
) {
    ModalBottomSheet(
        onDismissRequest = onDismiss
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp)
        ) {
            Text(
                text = "Add Items",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Mode selector
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                FilterChip(
                    selected = captureMode == CaptureMode.SINGLE,
                    onClick = { onCaptureModeChange(CaptureMode.SINGLE) },
                    label = { Text("Single Item") },
                    leadingIcon = {
                        Icon(Icons.Default.Checkroom, contentDescription = null)
                    },
                    modifier = Modifier.weight(1f)
                )
                FilterChip(
                    selected = captureMode == CaptureMode.OUTFIT,
                    onClick = { onCaptureModeChange(CaptureMode.OUTFIT) },
                    label = { Text("Full Outfit") },
                    leadingIcon = {
                        Icon(Icons.Default.Person, contentDescription = null)
                    },
                    modifier = Modifier.weight(1f)
                )
            }

            Spacer(modifier = Modifier.height(8.dp))

            Text(
                text = if (captureMode == CaptureMode.SINGLE) {
                    "Take a photo of a single clothing item"
                } else {
                    "Take a full-body photo to detect all items"
                },
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Camera/Gallery buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                Button(
                    onClick = { /* Open camera */ },
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.CameraAlt, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Camera")
                }
                OutlinedButton(
                    onClick = { /* Open gallery */ },
                    modifier = Modifier.weight(1f)
                ) {
                    Icon(Icons.Default.Photo, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Gallery")
                }
            }

            // Processing indicator
            if (isProcessing) {
                Spacer(modifier = Modifier.height(24.dp))
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    CircularProgressIndicator(modifier = Modifier.size(24.dp))
                    Spacer(modifier = Modifier.width(12.dp))
                    Text(
                        text = if (captureMode == CaptureMode.OUTFIT) "Detecting items..." else "Analyzing...",
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            // Detected items list (for outfit mode)
            if (detectedItems.isNotEmpty()) {
                Spacer(modifier = Modifier.height(24.dp))
                Text(
                    text = "Detected ${detectedItems.size} items",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Bold
                )
                Spacer(modifier = Modifier.height(12.dp))
                detectedItems.forEachIndexed { index, item ->
                    DetectedItemRow(
                        item = item,
                        onToggle = { onToggleDetectedItem(index) }
                    )
                    if (index < detectedItems.size - 1) {
                        Spacer(modifier = Modifier.height(8.dp))
                    }
                }
            }

            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}

@Composable
fun DetectedItemRow(
    item: com.styloai.app.data.model.DetectedItem,
    onToggle: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onToggle),
        colors = CardDefaults.cardColors(
            containerColor = if (item.isSelected) BrandIndigo.copy(alpha = 0.1f) else Gray100
        )
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Checkbox(
                checked = item.isSelected,
                onCheckedChange = { onToggle() }
            )
            Spacer(modifier = Modifier.width(12.dp))
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(CircleShape)
                    .background(ClothingColors.colorFor(item.primaryColor))
            )
            Spacer(modifier = Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = item.suggestedName,
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Medium
                )
                Text(
                    text = "${ClothingCategory.displayName(item.category)} • ${(item.confidence * 100).toInt()}% confidence",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}
