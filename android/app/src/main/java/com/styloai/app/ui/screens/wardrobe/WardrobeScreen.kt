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
import com.styloai.app.data.model.Occasion
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
            Column {
                // Manual entry FAB
                SmallFloatingActionButton(
                    onClick = { viewModel.showManualEntry() },
                    containerColor = Gray200
                ) {
                    Icon(Icons.Default.Edit, contentDescription = "Manual Entry", tint = Gray700)
                }
                Spacer(modifier = Modifier.height(12.dp))
                // Main add FAB
                FloatingActionButton(
                    onClick = { viewModel.showAddItem() },
                    containerColor = BrandIndigo
                ) {
                    Icon(Icons.Default.Add, contentDescription = "Add Item", tint = Color.White)
                }
            }
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Search bar
            OutlinedTextField(
                value = uiState.searchQuery,
                onValueChange = { viewModel.updateSearchQuery(it) },
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                placeholder = { Text("Search by name, color, brand...") },
                leadingIcon = {
                    Icon(Icons.Default.Search, contentDescription = "Search")
                },
                trailingIcon = {
                    if (uiState.searchQuery.isNotEmpty()) {
                        IconButton(onClick = { viewModel.updateSearchQuery("") }) {
                            Icon(Icons.Default.Clear, contentDescription = "Clear")
                        }
                    }
                },
                singleLine = true,
                shape = RoundedCornerShape(24.dp)
            )

            // Stats summary
            uiState.stats?.let { stats ->
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 16.dp, vertical = 8.dp)
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
            } else if (uiState.filteredItems.isEmpty() && uiState.items.isEmpty()) {
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
                        Spacer(modifier = Modifier.height(24.dp))
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            Button(onClick = { viewModel.showAddItem() }) {
                                Icon(Icons.Default.CameraAlt, contentDescription = null)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Add Photo")
                            }
                            OutlinedButton(onClick = { viewModel.showManualEntry() }) {
                                Icon(Icons.Default.Edit, contentDescription = null)
                                Spacer(modifier = Modifier.width(8.dp))
                                Text("Manual")
                            }
                        }
                    }
                }
            } else if (uiState.filteredItems.isEmpty() && uiState.searchQuery.isNotEmpty()) {
                Box(
                    modifier = Modifier.fillMaxSize(),
                    contentAlignment = Alignment.Center
                ) {
                    Column(
                        horizontalAlignment = Alignment.CenterHorizontally
                    ) {
                        Icon(
                            Icons.Default.SearchOff,
                            contentDescription = null,
                            modifier = Modifier.size(64.dp),
                            tint = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Spacer(modifier = Modifier.height(16.dp))
                        Text(
                            text = "No results found",
                            style = MaterialTheme.typography.titleMedium
                        )
                        Text(
                            text = "Try a different search term",
                            style = MaterialTheme.typography.bodyMedium,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            } else {
                val displayItems = if (uiState.searchQuery.isNotEmpty()) uiState.filteredItems else uiState.items
                LazyVerticalGrid(
                    columns = GridCells.Fixed(2),
                    contentPadding = PaddingValues(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(displayItems) { item ->
                        WardrobeItemCard(
                            item = item,
                            onClick = { viewModel.showItemDetail(item) },
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

        // Manual entry bottom sheet
        if (uiState.showManualEntry) {
            ManualEntryBottomSheet(
                data = uiState.manualEntryData,
                isProcessing = uiState.isProcessing,
                onNameChange = { viewModel.updateManualEntryName(it) },
                onCategoryChange = { viewModel.updateManualEntryCategory(it) },
                onColorChange = { viewModel.updateManualEntryColor(it) },
                onMaterialChange = { viewModel.updateManualEntryMaterial(it) },
                onBrandChange = { viewModel.updateManualEntryBrand(it) },
                onSeasonToggle = { viewModel.toggleManualEntrySeason(it) },
                onOccasionToggle = { viewModel.toggleManualEntryOccasion(it) },
                onSave = { viewModel.saveManualEntry() },
                onDismiss = { viewModel.hideManualEntry() }
            )
        }

        // Item detail bottom sheet
        if (uiState.showItemDetail && uiState.selectedItem != null) {
            ItemDetailBottomSheet(
                item = uiState.selectedItem!!,
                onFavoriteClick = { viewModel.toggleFavorite(uiState.selectedItem!!) },
                onWornClick = { viewModel.markItemWorn(uiState.selectedItem!!) },
                onDeleteClick = {
                    viewModel.deleteItem(uiState.selectedItem!!)
                    viewModel.hideItemDetail()
                },
                onDismiss = { viewModel.hideItemDetail() }
            )
        }
    }
}

@Composable
fun WardrobeItemCard(
    item: WardrobeItem,
    onClick: () -> Unit = {},
    onFavoriteClick: () -> Unit,
    onDeleteClick: () -> Unit
) {
    var showMenu by remember { mutableStateOf(false) }

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
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

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ManualEntryBottomSheet(
    data: ManualEntryData,
    isProcessing: Boolean,
    onNameChange: (String) -> Unit,
    onCategoryChange: (String) -> Unit,
    onColorChange: (String) -> Unit,
    onMaterialChange: (String) -> Unit,
    onBrandChange: (String) -> Unit,
    onSeasonToggle: (String) -> Unit,
    onOccasionToggle: (String) -> Unit,
    onSave: () -> Unit,
    onDismiss: () -> Unit
) {
    val seasons = listOf("spring", "summer", "fall", "winter", "all-season")
    val occasions = listOf("work", "casual", "formal", "sport", "party", "date")
    val colors = listOf("black", "white", "gray", "navy", "blue", "red", "green", "brown", "beige", "pink")

    ModalBottomSheet(
        onDismissRequest = onDismiss
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp)
        ) {
            Text(
                text = "Add Item Manually",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Name
            OutlinedTextField(
                value = data.name,
                onValueChange = onNameChange,
                label = { Text("Item Name *") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Category
            Text("Category", style = MaterialTheme.typography.labelMedium)
            Spacer(modifier = Modifier.height(8.dp))
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(ClothingCategory.all) { category ->
                    FilterChip(
                        selected = data.category == category,
                        onClick = { onCategoryChange(category) },
                        label = { Text(ClothingCategory.displayName(category)) }
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Color
            Text("Color", style = MaterialTheme.typography.labelMedium)
            Spacer(modifier = Modifier.height(8.dp))
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(colors) { color ->
                    FilterChip(
                        selected = data.primaryColor == color,
                        onClick = { onColorChange(color) },
                        label = { Text(color.replaceFirstChar { it.uppercase() }) },
                        leadingIcon = {
                            Box(
                                modifier = Modifier
                                    .size(16.dp)
                                    .clip(CircleShape)
                                    .background(ClothingColors.colorFor(color))
                            )
                        }
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Material and Brand in a row
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OutlinedTextField(
                    value = data.material,
                    onValueChange = onMaterialChange,
                    label = { Text("Material") },
                    modifier = Modifier.weight(1f),
                    singleLine = true
                )
                OutlinedTextField(
                    value = data.brand,
                    onValueChange = onBrandChange,
                    label = { Text("Brand") },
                    modifier = Modifier.weight(1f),
                    singleLine = true
                )
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Seasons
            Text("Seasons", style = MaterialTheme.typography.labelMedium)
            Spacer(modifier = Modifier.height(8.dp))
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(seasons) { season ->
                    FilterChip(
                        selected = data.selectedSeasons.contains(season),
                        onClick = { onSeasonToggle(season) },
                        label = { Text(season.replaceFirstChar { it.uppercase() }) }
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Occasions
            Text("Occasions", style = MaterialTheme.typography.labelMedium)
            Spacer(modifier = Modifier.height(8.dp))
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(occasions) { occasion ->
                    FilterChip(
                        selected = data.selectedOccasions.contains(occasion),
                        onClick = { onOccasionToggle(occasion) },
                        label = { Text(occasion.replaceFirstChar { it.uppercase() }) }
                    )
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Save button
            Button(
                onClick = onSave,
                modifier = Modifier.fillMaxWidth(),
                enabled = data.name.isNotBlank() && !isProcessing
            ) {
                if (isProcessing) {
                    CircularProgressIndicator(
                        modifier = Modifier.size(18.dp),
                        strokeWidth = 2.dp,
                        color = Color.White
                    )
                } else {
                    Icon(Icons.Default.Save, contentDescription = null)
                }
                Spacer(modifier = Modifier.width(8.dp))
                Text("Save Item")
            }

            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ItemDetailBottomSheet(
    item: WardrobeItem,
    onFavoriteClick: () -> Unit,
    onWornClick: () -> Unit,
    onDeleteClick: () -> Unit,
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
            // Image
            if (item.imageUrl.isNotEmpty()) {
                AsyncImage(
                    model = item.imageUrl,
                    contentDescription = item.name,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(200.dp)
                        .clip(RoundedCornerShape(12.dp)),
                    contentScale = ContentScale.Crop
                )
                Spacer(modifier = Modifier.height(16.dp))
            }

            // Name and category
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = item.name ?: ClothingCategory.displayName(item.category),
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Bold
                    )
                    Text(
                        text = ClothingCategory.displayName(item.category),
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                IconButton(onClick = onFavoriteClick) {
                    Icon(
                        imageVector = if (item.isFavorite) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                        contentDescription = "Favorite",
                        tint = if (item.isFavorite) ErrorRed else Gray400,
                        modifier = Modifier.size(28.dp)
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Details
            Card(
                colors = CardDefaults.cardColors(containerColor = Gray100)
            ) {
                Column(
                    modifier = Modifier.padding(16.dp)
                ) {
                    item.primaryColor?.let { color ->
                        DetailRow(
                            label = "Color",
                            value = color.replaceFirstChar { it.uppercase() },
                            leadingContent = {
                                Box(
                                    modifier = Modifier
                                        .size(20.dp)
                                        .clip(CircleShape)
                                        .background(ClothingColors.colorFor(color))
                                )
                            }
                        )
                    }
                    item.material?.let { material ->
                        DetailRow(label = "Material", value = material)
                    }
                    item.brand?.let { brand ->
                        DetailRow(label = "Brand", value = brand)
                    }
                    if (item.seasons.isNotEmpty()) {
                        DetailRow(
                            label = "Seasons",
                            value = item.seasons.joinToString(", ") { it.replaceFirstChar { c -> c.uppercase() } }
                        )
                    }
                    if (item.occasions.isNotEmpty()) {
                        DetailRow(
                            label = "Occasions",
                            value = item.occasions.joinToString(", ") { it.replaceFirstChar { c -> c.uppercase() } }
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Stats
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        text = item.wearCount.toString(),
                        style = MaterialTheme.typography.headlineSmall,
                        fontWeight = FontWeight.Bold,
                        color = BrandIndigo
                    )
                    Text(
                        text = "Times Worn",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                item.lastWorn?.let { lastWorn ->
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Text(
                            text = lastWorn,
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold,
                            color = BrandIndigo
                        )
                        Text(
                            text = "Last Worn",
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(24.dp))

            // Action buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OutlinedButton(
                    onClick = onDeleteClick,
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.outlinedButtonColors(
                        contentColor = ErrorRed
                    )
                ) {
                    Icon(Icons.Default.Delete, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Delete")
                }
                Button(
                    onClick = onWornClick,
                    modifier = Modifier.weight(1f),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = SuccessGreen
                    )
                ) {
                    Icon(Icons.Default.Check, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Mark Worn")
                }
            }

            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}

@Composable
private fun DetailRow(
    label: String,
    value: String,
    leadingContent: @Composable (() -> Unit)? = null
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 4.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            text = label,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            leadingContent?.invoke()
            Text(
                text = value,
                style = MaterialTheme.typography.bodyMedium,
                fontWeight = FontWeight.Medium
            )
        }
    }
}
