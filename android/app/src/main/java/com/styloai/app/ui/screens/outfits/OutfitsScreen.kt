package com.styloai.app.ui.screens.outfits

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage
import com.styloai.app.data.model.*
import com.styloai.app.ui.theme.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OutfitsScreen(
    viewModel: OutfitsViewModel = hiltViewModel()
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

    // Success snackbar
    uiState.successMessage?.let { message ->
        LaunchedEffect(message) {
            kotlinx.coroutines.delay(2000)
            viewModel.clearSuccessMessage()
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Outfits") },
                actions = {
                    IconButton(onClick = { viewModel.loadData() }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Refresh")
                    }
                }
            )
        },
        floatingActionButton = {
            FloatingActionButton(
                onClick = { viewModel.showCreateOutfit() },
                containerColor = BrandIndigo
            ) {
                Icon(Icons.Default.Add, contentDescription = "Create Outfit", tint = Color.White)
            }
        }
    ) { paddingValues ->
        if (uiState.isLoading) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator()
            }
        } else {
            LazyColumn(
                modifier = Modifier
                    .fillMaxSize()
                    .padding(paddingValues),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                // AI Recommendations Section
                if (uiState.recommendations.isNotEmpty()) {
                    item {
                        Text(
                            text = "Recommended for Today",
                            style = MaterialTheme.typography.titleMedium,
                            fontWeight = FontWeight.Bold
                        )
                    }

                    item {
                        LazyRow(
                            horizontalArrangement = Arrangement.spacedBy(12.dp)
                        ) {
                            items(uiState.recommendations) { recommendation ->
                                RecommendationCard(
                                    recommendation = recommendation,
                                    onClick = { }
                                )
                            }
                        }
                    }

                    item { Spacer(modifier = Modifier.height(8.dp)) }
                }

                // Saved Outfits Section
                item {
                    Text(
                        text = "Your Outfits",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                }

                if (uiState.outfits.isEmpty()) {
                    item {
                        EmptyOutfitsCard(
                            onCreateOutfit = { viewModel.showCreateOutfit() }
                        )
                    }
                } else {
                    items(uiState.outfits) { outfit ->
                        OutfitCard(
                            outfit = outfit,
                            onFavoriteClick = { viewModel.toggleFavorite(outfit) },
                            onWornClick = { viewModel.markWorn(outfit) },
                            onDeleteClick = { viewModel.deleteOutfit(outfit) }
                        )
                    }
                }
            }
        }

        // Create Outfit Sheet
        if (uiState.showCreateOutfit) {
            CreateOutfitSheet(
                wardrobeItems = uiState.wardrobeItems,
                selectedItems = uiState.selectedItems,
                outfitName = uiState.outfitName,
                selectedOccasion = uiState.selectedOccasion,
                isAnalyzing = uiState.isAnalyzing,
                analyzedOutfit = uiState.analyzedOutfit,
                onItemToggle = { viewModel.toggleItemSelection(it) },
                onNameChange = { viewModel.setOutfitName(it) },
                onOccasionChange = { viewModel.setOccasion(it) },
                onAnalyze = { viewModel.analyzeOutfit() },
                onSave = { viewModel.saveOutfit() },
                onDismiss = { viewModel.hideCreateOutfit() }
            )
        }
    }
}

@Composable
fun RecommendationCard(
    recommendation: OutfitRecommendation,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .width(280.dp)
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(
            containerColor = BrandIndigo.copy(alpha = 0.05f)
        )
    ) {
        Column(
            modifier = Modifier.padding(12.dp)
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    Icons.Default.AutoAwesome,
                    contentDescription = null,
                    tint = BrandIndigo,
                    modifier = Modifier.size(20.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(
                    text = "AI Recommended",
                    style = MaterialTheme.typography.labelSmall,
                    color = BrandIndigo
                )
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Outfit items
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                recommendation.outfit.items.take(4).forEach { item ->
                    AsyncImage(
                        model = item.imageUrl,
                        contentDescription = item.name,
                        modifier = Modifier
                            .size(56.dp)
                            .clip(RoundedCornerShape(8.dp)),
                        contentScale = ContentScale.Crop
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            Text(
                text = recommendation.recommendationReason,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 2
            )

            Spacer(modifier = Modifier.height(8.dp))

            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                recommendation.outfit.overallScore?.let { score ->
                    AssistChip(
                        onClick = { },
                        label = { Text("$score/100") },
                        leadingIcon = {
                            Icon(
                                Icons.Default.Star,
                                contentDescription = null,
                                modifier = Modifier.size(16.dp)
                            )
                        }
                    )
                }
                AssistChip(
                    onClick = { },
                    label = { Text(Occasion.displayName(recommendation.occasion)) }
                )
            }
        }
    }
}

@Composable
fun OutfitCard(
    outfit: Outfit,
    onFavoriteClick: () -> Unit,
    onWornClick: () -> Unit,
    onDeleteClick: () -> Unit
) {
    var showMenu by remember { mutableStateOf(false) }

    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Column {
                    Text(
                        text = outfit.name ?: "Outfit",
                        style = MaterialTheme.typography.titleMedium,
                        fontWeight = FontWeight.Bold
                    )
                    outfit.occasion?.let {
                        Text(
                            text = Occasion.displayName(it),
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }

                Row {
                    IconButton(onClick = onFavoriteClick) {
                        Icon(
                            imageVector = if (outfit.isFavorite) Icons.Default.Favorite else Icons.Default.FavoriteBorder,
                            contentDescription = "Favorite",
                            tint = if (outfit.isFavorite) ErrorRed else Gray400
                        )
                    }
                    Box {
                        IconButton(onClick = { showMenu = true }) {
                            Icon(Icons.Default.MoreVert, contentDescription = "More")
                        }
                        DropdownMenu(
                            expanded = showMenu,
                            onDismissRequest = { showMenu = false }
                        ) {
                            DropdownMenuItem(
                                text = { Text("Mark as Worn") },
                                onClick = {
                                    showMenu = false
                                    onWornClick()
                                },
                                leadingIcon = {
                                    Icon(Icons.Default.Check, contentDescription = null)
                                }
                            )
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

            Spacer(modifier = Modifier.height(12.dp))

            // Outfit items
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(outfit.items) { item ->
                    AsyncImage(
                        model = item.imageUrl,
                        contentDescription = item.name,
                        modifier = Modifier
                            .size(72.dp)
                            .clip(RoundedCornerShape(8.dp)),
                        contentScale = ContentScale.Crop
                    )
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            // Scores
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                outfit.overallScore?.let { score ->
                    ScoreChip(label = "Overall", score = score)
                }
                outfit.colorHarmonyScore?.let { score ->
                    ScoreChip(label = "Colors", score = score)
                }
                outfit.styleCoherenceScore?.let { score ->
                    ScoreChip(label = "Style", score = score)
                }
            }

            // AI Feedback
            outfit.aiFeedback?.let { feedback ->
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = feedback,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }

            // Wear stats
            Spacer(modifier = Modifier.height(8.dp))
            Row(
                horizontalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Text(
                    text = "Worn ${outfit.wearCount} times",
                    style = MaterialTheme.typography.labelSmall,
                    color = Gray500
                )
                outfit.lastWorn?.let { lastWorn ->
                    Text(
                        text = "Last: $lastWorn",
                        style = MaterialTheme.typography.labelSmall,
                        color = Gray500
                    )
                }
            }
        }
    }
}

@Composable
fun ScoreChip(label: String, score: Int) {
    val color = when {
        score >= 80 -> SuccessGreen
        score >= 60 -> AccentAmber
        else -> ErrorRed
    }

    Surface(
        shape = RoundedCornerShape(16.dp),
        color = color.copy(alpha = 0.1f)
    ) {
        Row(
            modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Text(
                text = label,
                style = MaterialTheme.typography.labelSmall,
                color = color
            )
            Spacer(modifier = Modifier.width(4.dp))
            Text(
                text = "$score",
                style = MaterialTheme.typography.labelSmall,
                fontWeight = FontWeight.Bold,
                color = color
            )
        }
    }
}

@Composable
fun EmptyOutfitsCard(onCreateOutfit: () -> Unit) {
    Card(
        modifier = Modifier.fillMaxWidth()
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(32.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                Icons.Default.Style,
                contentDescription = null,
                modifier = Modifier.size(64.dp),
                tint = Gray400
            )
            Spacer(modifier = Modifier.height(16.dp))
            Text(
                text = "No outfits yet",
                style = MaterialTheme.typography.titleMedium
            )
            Text(
                text = "Create your first outfit by combining items from your wardrobe",
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                textAlign = TextAlign.Center
            )
            Spacer(modifier = Modifier.height(24.dp))
            Button(onClick = onCreateOutfit) {
                Icon(Icons.Default.Add, contentDescription = null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Create Outfit")
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CreateOutfitSheet(
    wardrobeItems: List<WardrobeItem>,
    selectedItems: List<WardrobeItem>,
    outfitName: String,
    selectedOccasion: String?,
    isAnalyzing: Boolean,
    analyzedOutfit: Outfit?,
    onItemToggle: (WardrobeItem) -> Unit,
    onNameChange: (String) -> Unit,
    onOccasionChange: (String?) -> Unit,
    onAnalyze: () -> Unit,
    onSave: () -> Unit,
    onDismiss: () -> Unit
) {
    ModalBottomSheet(
        onDismissRequest = onDismiss
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 24.dp)
        ) {
            Text(
                text = "Create Outfit",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Outfit name
            OutlinedTextField(
                value = outfitName,
                onValueChange = onNameChange,
                label = { Text("Outfit Name (optional)") },
                modifier = Modifier.fillMaxWidth(),
                singleLine = true
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Occasion selector
            Text(
                text = "Occasion",
                style = MaterialTheme.typography.labelMedium
            )
            Spacer(modifier = Modifier.height(8.dp))
            LazyRow(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                items(Occasion.all) { occasion ->
                    FilterChip(
                        selected = selectedOccasion == occasion,
                        onClick = {
                            onOccasionChange(if (selectedOccasion == occasion) null else occasion)
                        },
                        label = { Text(Occasion.displayName(occasion)) }
                    )
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Selected items preview
            if (selectedItems.isNotEmpty()) {
                Text(
                    text = "Selected Items (${selectedItems.size})",
                    style = MaterialTheme.typography.labelMedium
                )
                Spacer(modifier = Modifier.height(8.dp))
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(selectedItems) { item ->
                        Box {
                            AsyncImage(
                                model = item.imageUrl,
                                contentDescription = item.name,
                                modifier = Modifier
                                    .size(64.dp)
                                    .clip(RoundedCornerShape(8.dp))
                                    .clickable { onItemToggle(item) },
                                contentScale = ContentScale.Crop
                            )
                            Icon(
                                Icons.Default.Close,
                                contentDescription = "Remove",
                                modifier = Modifier
                                    .align(Alignment.TopEnd)
                                    .size(20.dp)
                                    .clip(CircleShape)
                                    .background(Color.White)
                                    .padding(2.dp)
                                    .clickable { onItemToggle(item) },
                                tint = Gray600
                            )
                        }
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
            }

            // Wardrobe items grid
            Text(
                text = "Select Items",
                style = MaterialTheme.typography.labelMedium
            )
            Spacer(modifier = Modifier.height(8.dp))

            if (wardrobeItems.isEmpty()) {
                Text(
                    text = "No items in your wardrobe yet",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            } else {
                LazyVerticalGrid(
                    columns = GridCells.Fixed(4),
                    modifier = Modifier.height(200.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(wardrobeItems) { item ->
                        val isSelected = selectedItems.any { it.id == item.id }
                        Box(
                            modifier = Modifier
                                .aspectRatio(1f)
                                .clip(RoundedCornerShape(8.dp))
                                .border(
                                    width = if (isSelected) 2.dp else 0.dp,
                                    color = if (isSelected) BrandIndigo else Color.Transparent,
                                    shape = RoundedCornerShape(8.dp)
                                )
                                .clickable { onItemToggle(item) }
                        ) {
                            AsyncImage(
                                model = item.imageUrl,
                                contentDescription = item.name,
                                modifier = Modifier.fillMaxSize(),
                                contentScale = ContentScale.Crop
                            )
                            if (isSelected) {
                                Box(
                                    modifier = Modifier
                                        .align(Alignment.TopEnd)
                                        .padding(4.dp)
                                        .size(20.dp)
                                        .clip(CircleShape)
                                        .background(BrandIndigo),
                                    contentAlignment = Alignment.Center
                                ) {
                                    Icon(
                                        Icons.Default.Check,
                                        contentDescription = null,
                                        tint = Color.White,
                                        modifier = Modifier.size(14.dp)
                                    )
                                }
                            }
                        }
                    }
                }
            }

            Spacer(modifier = Modifier.height(16.dp))

            // Analysis result
            analyzedOutfit?.let { outfit ->
                Card(
                    colors = CardDefaults.cardColors(
                        containerColor = SuccessGreen.copy(alpha = 0.1f)
                    )
                ) {
                    Column(
                        modifier = Modifier.padding(12.dp)
                    ) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically
                        ) {
                            Icon(
                                Icons.Default.AutoAwesome,
                                contentDescription = null,
                                tint = SuccessGreen
                            )
                            Spacer(modifier = Modifier.width(8.dp))
                            Text(
                                text = "AI Analysis",
                                style = MaterialTheme.typography.titleSmall,
                                fontWeight = FontWeight.Bold
                            )
                        }
                        Spacer(modifier = Modifier.height(8.dp))
                        Row(
                            horizontalArrangement = Arrangement.spacedBy(8.dp)
                        ) {
                            outfit.overallScore?.let { ScoreChip("Overall", it) }
                            outfit.colorHarmonyScore?.let { ScoreChip("Colors", it) }
                        }
                        outfit.aiFeedback?.let { feedback ->
                            Spacer(modifier = Modifier.height(8.dp))
                            Text(
                                text = feedback,
                                style = MaterialTheme.typography.bodySmall
                            )
                        }
                    }
                }
                Spacer(modifier = Modifier.height(16.dp))
            }

            // Action buttons
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                OutlinedButton(
                    onClick = onAnalyze,
                    modifier = Modifier.weight(1f),
                    enabled = selectedItems.isNotEmpty() && !isAnalyzing
                ) {
                    if (isAnalyzing) {
                        CircularProgressIndicator(
                            modifier = Modifier.size(18.dp),
                            strokeWidth = 2.dp
                        )
                    } else {
                        Icon(Icons.Default.AutoAwesome, contentDescription = null)
                    }
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Analyze")
                }
                Button(
                    onClick = onSave,
                    modifier = Modifier.weight(1f),
                    enabled = selectedItems.isNotEmpty() && !isAnalyzing
                ) {
                    Icon(Icons.Default.Save, contentDescription = null)
                    Spacer(modifier = Modifier.width(8.dp))
                    Text("Save")
                }
            }

            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}
