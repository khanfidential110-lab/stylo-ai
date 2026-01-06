package com.styloai.app.ui.screens.wardrobe

import android.net.Uri
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import androidx.compose.runtime.collectAsState
import coil.compose.rememberAsyncImagePainter

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ItemEditScreen(
    imageUri: String,
    onBack: () -> Unit,
    onSaveSuccess: () -> Unit,
    viewModel: ItemEditViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    
    // Dropdown states
    var categoryExpanded by remember { mutableStateOf(false) }
    var colorExpanded by remember { mutableStateOf(false) }
    var materialExpanded by remember { mutableStateOf(false) }
    var seasonExpanded by remember { mutableStateOf(false) }

    val categories = listOf("Tops", "Bottoms", "Dresses", "Outerwear", "Shoes", "Accessories", "Activewear")
    val colors = listOf("Black", "White", "Navy", "Gray", "Red", "Blue", "Green", "Pink", "Brown", "Beige", "Purple", "Yellow", "Orange")
    val materials = listOf("Cotton", "Polyester", "Wool", "Silk", "Linen", "Denim", "Leather", "Synthetic")
    val seasons = listOf("Spring", "Summer", "Fall", "Winter", "All Seasons")

    LaunchedEffect(imageUri) {
        viewModel.init(imageUri)
    }

    LaunchedEffect(uiState.saveSuccess) {
        if (uiState.saveSuccess) {
            onSaveSuccess()
        }
    }

    Scaffold(
        topBar = {
            CenterAlignedTopAppBar(
                title = { Text("Item Details", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold)) },
                navigationIcon = {
                    IconButton(onClick = onBack) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = Color.White
                )
            )
        },
        bottomBar = {
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color.White)
                    .padding(16.dp)
            ) {
                Button(
                    onClick = viewModel::saveItem,
                    enabled = !uiState.isSaving && !uiState.isAnalyzing && uiState.category.isNotEmpty(),
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(56.dp),
                    shape = RoundedCornerShape(16.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = Color(0xFF3B3FF1)
                    )
                ) {
                    if (uiState.isSaving) {
                        CircularProgressIndicator(color = Color.White, modifier = Modifier.size(24.dp))
                    } else {
                        Text("Save to Wardrobe", style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold))
                    }
                }
            }
        }
    ) { paddingValues ->
        LazyColumn(
            modifier = Modifier
                .fillMaxSize()
                .background(Color(0xFFF6F6F8))
                .padding(paddingValues)
        ) {
            item {
                // 1. Image Preview
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(260.dp)
                        .background(Color.White)
                ) {
                    if (uiState.imageUri != null) {
                        Image(
                            painter = rememberAsyncImagePainter(model = uiState.imageUri),
                            contentDescription = null,
                            modifier = Modifier.fillMaxSize(),
                            contentScale = ContentScale.Crop
                        )
                    } else {
                        Box(
                            modifier = Modifier.fillMaxSize().background(Color(0xFFF3F4F6)),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                Icon(Icons.Outlined.AddAPhoto, null, modifier = Modifier.size(64.dp), tint = Color.LightGray)
                                Spacer(modifier = Modifier.height(8.dp))
                                Text("Manual Entry Mode", color = Color.Gray)
                            }
                        }
                    }
                    
                    if (uiState.isAnalyzing) {
                        Box(
                            modifier = Modifier.fillMaxSize().background(Color.Black.copy(alpha = 0.5f)),
                            contentAlignment = Alignment.Center
                        ) {
                            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                                CircularProgressIndicator(color = Color.White)
                                Spacer(modifier = Modifier.height(8.dp))
                                Text("AI Analyzing...", color = Color.White, fontWeight = FontWeight.Bold)
                            }
                        }
                    }
                }
            }

            item {
                // 2. Item Name
                Column(
                    modifier = Modifier
                        .padding(16.dp)
                        .fillMaxWidth()
                ) {
                    Text(
                        "Item Name", 
                        style = MaterialTheme.typography.labelLarge, 
                        color = Color(0xFF374151),
                        modifier = Modifier.padding(bottom = 8.dp, start = 4.dp)
                    )
                    
                    OutlinedTextField(
                        value = uiState.itemName,
                        onValueChange = viewModel::updateName,
                        placeholder = { Text("e.g., Blue Denim Jacket") },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            unfocusedBorderColor = Color(0xFFE5E7EB),
                            focusedBorderColor = Color(0xFF3B3FF1),
                            unfocusedContainerColor = Color.White,
                            focusedContainerColor = Color.White
                        )
                    )
                }
            }

            item {
                // 3. Category Dropdown
                Column(
                    modifier = Modifier
                        .padding(horizontal = 16.dp)
                        .fillMaxWidth()
                ) {
                    Text(
                        "Category *", 
                        style = MaterialTheme.typography.labelLarge, 
                        color = Color(0xFF374151),
                        modifier = Modifier.padding(bottom = 8.dp, start = 4.dp)
                    )
                    
                    ExposedDropdownMenuBox(
                        expanded = categoryExpanded,
                        onExpandedChange = { categoryExpanded = it }
                    ) {
                        OutlinedTextField(
                            value = uiState.category.ifEmpty { "Select Category" },
                            onValueChange = {},
                            readOnly = true,
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = categoryExpanded) },
                            modifier = Modifier.fillMaxWidth().menuAnchor(),
                            shape = RoundedCornerShape(12.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                unfocusedBorderColor = Color(0xFFE5E7EB),
                                focusedBorderColor = Color(0xFF3B3FF1),
                                unfocusedContainerColor = Color.White,
                                focusedContainerColor = Color.White
                            )
                        )
                        ExposedDropdownMenu(
                            expanded = categoryExpanded,
                            onDismissRequest = { categoryExpanded = false }
                        ) {
                            categories.forEach { category ->
                                DropdownMenuItem(
                                    text = { Text(category) },
                                    onClick = {
                                        viewModel.updateCategory(category)
                                        categoryExpanded = false
                                    }
                                )
                            }
                        }
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
            }

            item {
                // 4. Color Dropdown
                Column(
                    modifier = Modifier
                        .padding(horizontal = 16.dp)
                        .fillMaxWidth()
                ) {
                    Text(
                        "Color", 
                        style = MaterialTheme.typography.labelLarge, 
                        color = Color(0xFF374151),
                        modifier = Modifier.padding(bottom = 8.dp, start = 4.dp)
                    )
                    
                    ExposedDropdownMenuBox(
                        expanded = colorExpanded,
                        onExpandedChange = { colorExpanded = it }
                    ) {
                        OutlinedTextField(
                            value = uiState.color.ifEmpty { "Select Color" },
                            onValueChange = {},
                            readOnly = true,
                            trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = colorExpanded) },
                            modifier = Modifier.fillMaxWidth().menuAnchor(),
                            shape = RoundedCornerShape(12.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                unfocusedBorderColor = Color(0xFFE5E7EB),
                                focusedBorderColor = Color(0xFF3B3FF1),
                                unfocusedContainerColor = Color.White,
                                focusedContainerColor = Color.White
                            )
                        )
                        ExposedDropdownMenu(
                            expanded = colorExpanded,
                            onDismissRequest = { colorExpanded = false }
                        ) {
                            colors.forEach { color ->
                                DropdownMenuItem(
                                    text = { Text(color) },
                                    onClick = {
                                        viewModel.updateColor(color)
                                        colorExpanded = false
                                    }
                                )
                            }
                        }
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
            }

            item {
                // 5. Material & Season Row
                Row(
                    modifier = Modifier
                        .padding(horizontal = 16.dp)
                        .fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    // Material
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            "Material", 
                            style = MaterialTheme.typography.labelLarge, 
                            color = Color(0xFF374151),
                            modifier = Modifier.padding(bottom = 8.dp, start = 4.dp)
                        )
                        
                        ExposedDropdownMenuBox(
                            expanded = materialExpanded,
                            onExpandedChange = { materialExpanded = it }
                        ) {
                            OutlinedTextField(
                                value = uiState.material,
                                onValueChange = {},
                                readOnly = true,
                                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = materialExpanded) },
                                modifier = Modifier.fillMaxWidth().menuAnchor(),
                                shape = RoundedCornerShape(12.dp),
                                colors = OutlinedTextFieldDefaults.colors(
                                    unfocusedContainerColor = Color.White,
                                    focusedContainerColor = Color.White
                                )
                            )
                            ExposedDropdownMenu(
                                expanded = materialExpanded,
                                onDismissRequest = { materialExpanded = false }
                            ) {
                                materials.forEach { material ->
                                    DropdownMenuItem(
                                        text = { Text(material) },
                                        onClick = {
                                            viewModel.updateMaterial(material)
                                            materialExpanded = false
                                        }
                                    )
                                }
                            }
                        }
                    }

                    // Season
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            "Season", 
                            style = MaterialTheme.typography.labelLarge, 
                            color = Color(0xFF374151),
                            modifier = Modifier.padding(bottom = 8.dp, start = 4.dp)
                        )
                        
                        ExposedDropdownMenuBox(
                            expanded = seasonExpanded,
                            onExpandedChange = { seasonExpanded = it }
                        ) {
                            OutlinedTextField(
                                value = uiState.season,
                                onValueChange = {},
                                readOnly = true,
                                trailingIcon = { ExposedDropdownMenuDefaults.TrailingIcon(expanded = seasonExpanded) },
                                modifier = Modifier.fillMaxWidth().menuAnchor(),
                                shape = RoundedCornerShape(12.dp),
                                colors = OutlinedTextFieldDefaults.colors(
                                    unfocusedContainerColor = Color.White,
                                    focusedContainerColor = Color.White
                                )
                            )
                            ExposedDropdownMenu(
                                expanded = seasonExpanded,
                                onDismissRequest = { seasonExpanded = false }
                            ) {
                                seasons.forEach { season ->
                                    DropdownMenuItem(
                                        text = { Text(season) },
                                        onClick = {
                                            viewModel.updateSeason(season)
                                            seasonExpanded = false
                                        }
                                    )
                                }
                            }
                        }
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
            }

            item {
                // 6. Brand & Size Row
                Row(
                    modifier = Modifier
                        .padding(horizontal = 16.dp)
                        .padding(bottom = 100.dp)
                        .fillMaxWidth(),
                    horizontalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            "Brand", 
                            style = MaterialTheme.typography.labelLarge, 
                            color = Color(0xFF374151),
                            modifier = Modifier.padding(bottom = 8.dp, start = 4.dp)
                        )
                        OutlinedTextField(
                            value = uiState.brand,
                            onValueChange = viewModel::updateBrand,
                            placeholder = { Text("e.g., Nike") },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                unfocusedContainerColor = Color.White,
                                focusedContainerColor = Color.White
                            )
                        )
                    }
                    
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            "Size", 
                            style = MaterialTheme.typography.labelLarge, 
                            color = Color(0xFF374151),
                            modifier = Modifier.padding(bottom = 8.dp, start = 4.dp)
                        )
                        OutlinedTextField(
                            value = uiState.size,
                            onValueChange = viewModel::updateSize,
                            placeholder = { Text("e.g., M") },
                            modifier = Modifier.fillMaxWidth(),
                            shape = RoundedCornerShape(12.dp),
                            colors = OutlinedTextFieldDefaults.colors(
                                unfocusedContainerColor = Color.White,
                                focusedContainerColor = Color.White
                            )
                        )
                    }
                }
            }
        }
    }

    if (uiState.error != null) {
        AlertDialog(
            onDismissRequest = viewModel::clearError,
            title = { Text("Error") },
            text = { Text(uiState.error!!) },
            confirmButton = {
                TextButton(onClick = viewModel::clearError) {
                    Text("OK")
                }
            }
        )
    }
}
