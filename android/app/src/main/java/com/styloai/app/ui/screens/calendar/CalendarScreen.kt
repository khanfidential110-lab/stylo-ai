package com.styloai.app.ui.screens.calendar

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
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
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.rememberAsyncImagePainter
import com.styloai.app.data.model.OutfitCalendarEntry
import java.time.LocalDate
import java.time.YearMonth
import java.time.format.DateTimeFormatter
import java.time.format.TextStyle
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CalendarScreen(
    onBack: () -> Unit = {},
    onPlanOutfit: () -> Unit = {},
    viewModel: CalendarViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val error by viewModel.error.collectAsState(initial = null)
    val loading by viewModel.loading.collectAsState()
    
    val snackbarHostState = remember { SnackbarHostState() }
    var showDetailsSheet by remember { mutableStateOf(false) }

    val currentMonth = uiState.currentMonth
    val daysInMonth = currentMonth.lengthOfMonth()
    val firstDayOfWeek = currentMonth.atDay(1).dayOfWeek.value % 7 // 0=Sunday, 1=Monday...

    LaunchedEffect(error) {
        error?.let {
            snackbarHostState.showSnackbar(it)
        }
    }

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        containerColor = Color(0xFFF6F6F8)
    ) { padding ->
        Box(modifier = Modifier.padding(padding).fillMaxSize()) {
        Column(modifier = Modifier.fillMaxSize().padding(bottom = 80.dp)) {
            // 1. Header
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color.White)
                    .padding(16.dp)
                    .statusBarsPadding(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(
                    onClick = onBack,
                    modifier = Modifier
                        .size(48.dp)
                        .clip(CircleShape)
                        .background(Color.Transparent)
                ) {
                    Icon(Icons.Default.ArrowBack, contentDescription = "Back")
                }
                
                Text(
                    "Calendar", 
                    style = MaterialTheme.typography.titleMedium.copy(fontWeight = FontWeight.Bold),
                    color = Color(0xFF111118)
                )
                
                TextButton(onClick = { viewModel.onDateSelected(LocalDate.now()) }) {
                    Text("Today", color = Color(0xFF3B3FF1), fontWeight = FontWeight.Bold)
                }
            }

            // 2. Month Navigation
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color.White)
                    .padding(horizontal = 24.dp, vertical = 16.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = { viewModel.onMonthChanged(false) }) { Icon(Icons.Default.ChevronLeft, null) }
                Text(
                    text = "${currentMonth.month.getDisplayName(TextStyle.FULL, Locale.getDefault())} ${currentMonth.year}",
                    fontWeight = FontWeight.Bold,
                    fontSize = 20.sp
                )
                IconButton(onClick = { viewModel.onMonthChanged(true) }) { Icon(Icons.Default.ChevronRight, null) }
            }

            // 3. Calendar Grid
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(Color.White)
                    .padding(horizontal = 8.dp)
                    .padding(bottom = 24.dp)
                    .clip(RoundedCornerShape(bottomStart = 24.dp, bottomEnd = 24.dp))
            ) {
                // Weekday Headers
                Row(modifier = Modifier.fillMaxWidth().padding(bottom = 8.dp)) {
                    listOf("S", "M", "T", "W", "T", "F", "S").forEach { day ->
                        Text(
                            text = day,
                            modifier = Modifier.weight(1f),
                            textAlign = TextAlign.Center,
                            color = Color(0xFF616289),
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp
                        )
                    }
                }

                // Days
                LazyVerticalGrid(
                    columns = GridCells.Fixed(7),
                    verticalArrangement = Arrangement.spacedBy(16.dp),
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                    modifier = Modifier.fillMaxWidth().weight(1f)
                ) {
                    // Empty cells for alignment
                    items(firstDayOfWeek) { Spacer(modifier = Modifier.height(80.dp)) }
                    
                    items(daysInMonth) { index ->
                        val dayNum = index + 1
                        val date = currentMonth.atDay(dayNum)
                        val isToday = date == LocalDate.now()
                        val isSelected = date == uiState.selectedDate
                        
                        val entry = uiState.entries.find { 
                            try {
                                LocalDate.parse(it.date, DateTimeFormatter.ISO_DATE) == date
                            } catch(e: Exception) {
                                false
                            }
                        }
                        
                        CalendarDayItem(
                            day = dayNum,
                            isToday = isToday,
                            isSelected = isSelected,
                            imageUrl = entry?.outfit?.items?.firstOrNull()?.imageUrl,
                            onClick = { 
                                viewModel.onDateSelected(date)
                                if (entry != null) showDetailsSheet = true
                            }
                        )
                    }
                }
            }
        }

        // FAB
        Box(
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .padding(bottom = 100.dp, end = 16.dp)
        ) {
            FloatingActionButton(
                onClick = onPlanOutfit,
                containerColor = Color(0xFF3B3FF1),
                contentColor = Color.White,
                shape = CircleShape,
                modifier = Modifier.size(56.dp)
            ) {
                Icon(Icons.Default.Edit, "Stylus")
            }
        }

        if (showDetailsSheet) {
            val entry = uiState.entries.find { 
                try {
                    LocalDate.parse(it.date, DateTimeFormatter.ISO_DATE) == uiState.selectedDate
                } catch(e: Exception) {
                    false
                }
            }
            if (entry != null) {
                ModalBottomSheet(
                    onDismissRequest = { showDetailsSheet = false },
                    containerColor = Color.Transparent
                ) {
                    DayDetailsSheet(
                        entry = entry,
                        onConfirmWorn = {
                            viewModel.confirmWorn(entry.outfitId)
                            showDetailsSheet = false
                        },
                        onClose = { showDetailsSheet = false }
                    )
                }
            }
        }
    }
    }
}

@Composable
fun CalendarDayItem(
    day: Int,
    isToday: Boolean,
    isSelected: Boolean,
    imageUrl: String?,
    onClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .height(80.dp)
            .clickable(onClick = onClick),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Top
    ) {
        Box(
            modifier = Modifier
                .size(28.dp)
                .background(if (isToday) Color(0xFF3B3FF1) else Color.Transparent, CircleShape)
                .then(if (isSelected && !isToday) Modifier.border(1.dp, Color(0xFF3B3FF1), CircleShape) else Modifier),
            contentAlignment = Alignment.Center
        ) {
            Text(
                day.toString(), 
                color = if (isToday) Color.White else if (isSelected) Color(0xFF3B3FF1) else Color(0xFF111118), 
                fontSize = 12.sp, 
                fontWeight = FontWeight.Bold
            )
        }

        Spacer(modifier = Modifier.height(4.dp))

        if (imageUrl != null) {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .clip(RoundedCornerShape(8.dp))
                    .border(
                        width = if (isToday || isSelected) 2.dp else 0.dp,
                        color = if (isToday || isSelected) Color(0xFF3B3FF1) else Color.Transparent,
                        shape = RoundedCornerShape(8.dp)
                    )
            ) {
                Image(
                    painter = rememberAsyncImagePainter(model = imageUrl),
                    contentDescription = null,
                    modifier = Modifier.fillMaxSize(),
                    contentScale = ContentScale.Crop
                )
            }
        } else {
            Box(
                modifier = Modifier
                    .size(40.dp)
                    .background(Color(0xFFF3F4F6), RoundedCornerShape(8.dp))
                    .border(1.dp, Color(0xFFE5E7EB), RoundedCornerShape(8.dp)),
                contentAlignment = Alignment.Center
            ) {
                Icon(Icons.Default.Add, null, tint = Color(0xFFD1D5DB), modifier = Modifier.size(20.dp))
            }
        }
        
        if (isToday) {
            Text("Today", fontSize = 10.sp, color = Color(0xFF3B3FF1), fontWeight = FontWeight.Bold, modifier = Modifier.padding(top = 2.dp))
        }
    }
}

@Composable
fun DayDetailsSheet(
    entry: OutfitCalendarEntry,
    onConfirmWorn: () -> Unit,
    onClose: () -> Unit
) {
    val date = try {
        LocalDate.parse(entry.date, DateTimeFormatter.ISO_DATE)
    } catch(e: Exception) {
        LocalDate.now()
    }
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(topStart = 24.dp, topEnd = 24.dp))
            .background(Color.White)
            .padding(24.dp)
            .padding(bottom = 24.dp)
    ) {
        Row(
            modifier = Modifier.fillMaxWidth().padding(bottom = 24.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Column {
                Text(
                    text = if (date == LocalDate.now()) "Today" else date.dayOfWeek.getDisplayName(TextStyle.FULL, Locale.getDefault()),
                    fontSize = 24.sp, 
                    fontWeight = FontWeight.Bold, 
                    color = Color(0xFF111118)
                )
                Text(
                    text = date.format(DateTimeFormatter.ofPattern("EEEE, MMMM d")),
                    color = Color(0xFF616289),
                    fontWeight = FontWeight.Medium
                )
            }
            Box(
                modifier = Modifier
                    .clip(RoundedCornerShape(20.dp))
                    .background(Color(0xFFF3F4F6))
                    .padding(horizontal = 12.dp, vertical = 6.dp)
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Icon(Icons.Outlined.WbSunny, null, tint = Color(0xFFF97316), modifier = Modifier.size(16.dp))
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("74°", fontWeight = FontWeight.Bold)
                }
            }
        }

        // Outfit Card
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .background(Color(0xFFF6F6F8), RoundedCornerShape(16.dp))
                .padding(16.dp)
        ) {
            Image(
                painter = rememberAsyncImagePainter(entry.outfit?.items?.firstOrNull()?.imageUrl ?: ""),
                contentDescription = null,
                modifier = Modifier
                    .size(width = 80.dp, height = 100.dp)
                    .clip(RoundedCornerShape(12.dp)),
                contentScale = ContentScale.Crop
            )
            
            Spacer(modifier = Modifier.width(16.dp))
            
            Column {
                Box(
                    modifier = Modifier
                        .background(Color(0xFFDBEAFE), RoundedCornerShape(4.dp))
                        .padding(horizontal = 8.dp, vertical = 4.dp)
                ) {
                    Text(entry.occasion?.uppercase() ?: "OUTFIT", color = Color(0xFF1D4ED8), fontSize = 10.sp, fontWeight = FontWeight.Bold)
                }
                Spacer(modifier = Modifier.height(8.dp))
                Text(entry.outfit?.name ?: "Suggested Look", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                Text("Perfect for your daily schedule and current weather.", fontSize = 12.sp, color = Color(0xFF616289))
            }
        }
        
        Spacer(modifier = Modifier.height(24.dp))
        
        Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            Button(
                onClick = { /* TODO: Edit Log */ }, 
                modifier = Modifier.weight(1f).height(50.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFF3F4F6), contentColor = Color(0xFF111118)),
                shape = RoundedCornerShape(12.dp)
            ) {
                Text("Edit Log")
            }
            Button(
                onClick = onConfirmWorn, 
                modifier = Modifier.weight(1f).height(50.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = if (entry.wasWorn) Color(0xFF22C55E) else Color(0xFF3B3FF1)
                ),
                shape = RoundedCornerShape(12.dp)
            ) {
                Icon(
                    if (entry.wasWorn) Icons.Default.CheckCircle else Icons.Default.CheckCircle, 
                    null, 
                    modifier = Modifier.size(18.dp)
                )
                Spacer(modifier = Modifier.width(8.dp))
                Text(if (entry.wasWorn) "Worn" else "Confirm Worn")
            }
        }
    }
}
