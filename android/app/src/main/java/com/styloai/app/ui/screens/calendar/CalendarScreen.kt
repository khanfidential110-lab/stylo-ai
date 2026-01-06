package com.styloai.app.ui.screens.calendar

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
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
import com.styloai.app.data.model.Outfit
import com.styloai.app.data.model.OutfitCalendarEntry
import com.styloai.app.ui.theme.*
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun CalendarScreen(
    viewModel: CalendarViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Outfit Calendar") },
                actions = {
                    IconButton(onClick = { viewModel.loadCalendarData() }) {
                        Icon(Icons.Default.Refresh, contentDescription = "Refresh")
                    }
                }
            )
        }
    ) { paddingValues ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(paddingValues)
        ) {
            // Month Navigation
            MonthNavigationHeader(
                currentMonth = uiState.currentMonth,
                onPreviousMonth = { viewModel.previousMonth() },
                onNextMonth = { viewModel.nextMonth() }
            )

            // Calendar Grid
            CalendarGrid(
                currentMonth = uiState.currentMonth,
                selectedDate = uiState.selectedDate,
                onDateSelected = { viewModel.selectDate(it) },
                hasOutfitPlanned = { viewModel.hasOutfitPlanned(it) },
                isToday = { viewModel.isToday(it) }
            )

            Spacer(modifier = Modifier.height(16.dp))

            // Selected Day Details
            uiState.selectedDate?.let { selectedDate ->
                SelectedDaySection(
                    date = selectedDate,
                    entry = uiState.selectedDayEntry,
                    onPlanOutfit = { viewModel.showPlanOutfit() },
                    onMarkWorn = { entryId -> viewModel.markOutfitWorn(entryId) }
                )
            } ?: run {
                // No date selected - show hint
                EmptySelectionHint()
            }
        }

        // Plan Outfit Sheet
        if (uiState.showPlanOutfitSheet) {
            PlanOutfitSheet(
                outfits = uiState.outfits,
                onDismiss = { viewModel.hidePlanOutfit() },
                onSelectOutfit = { outfitId ->
                    viewModel.planOutfit(outfitId)
                }
            )
        }
    }
}

@Composable
fun MonthNavigationHeader(
    currentMonth: Calendar,
    onPreviousMonth: () -> Unit,
    onNextMonth: () -> Unit
) {
    val monthFormat = SimpleDateFormat("MMMM yyyy", Locale.getDefault())

    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        IconButton(onClick = onPreviousMonth) {
            Icon(Icons.Default.ChevronLeft, contentDescription = "Previous month")
        }

        Text(
            text = monthFormat.format(currentMonth.time),
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold
        )

        IconButton(onClick = onNextMonth) {
            Icon(Icons.Default.ChevronRight, contentDescription = "Next month")
        }
    }
}

@Composable
fun CalendarGrid(
    currentMonth: Calendar,
    selectedDate: Calendar?,
    onDateSelected: (Calendar) -> Unit,
    hasOutfitPlanned: (Calendar) -> Boolean,
    isToday: (Calendar) -> Boolean
) {
    val daysOfWeek = listOf("Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat")

    Column(
        modifier = Modifier.padding(horizontal = 16.dp)
    ) {
        // Days of week header
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceEvenly
        ) {
            daysOfWeek.forEach { day ->
                Text(
                    text = day,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.weight(1f),
                    textAlign = TextAlign.Center
                )
            }
        }

        Spacer(modifier = Modifier.height(8.dp))

        // Calendar days
        val calendar = currentMonth.clone() as Calendar
        calendar.set(Calendar.DAY_OF_MONTH, 1)
        val firstDayOfWeek = calendar.get(Calendar.DAY_OF_WEEK) - 1
        val daysInMonth = calendar.getActualMaximum(Calendar.DAY_OF_MONTH)

        var dayCounter = 1
        for (week in 0..5) {
            if (dayCounter > daysInMonth) break

            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                for (dayOfWeek in 0..6) {
                    if ((week == 0 && dayOfWeek < firstDayOfWeek) || dayCounter > daysInMonth) {
                        // Empty cell
                        Box(modifier = Modifier.weight(1f).aspectRatio(1f))
                    } else {
                        val dayCalendar = (currentMonth.clone() as Calendar).apply {
                            set(Calendar.DAY_OF_MONTH, dayCounter)
                        }
                        val isSelected = selectedDate?.let {
                            it.get(Calendar.DAY_OF_MONTH) == dayCounter &&
                                    it.get(Calendar.MONTH) == currentMonth.get(Calendar.MONTH) &&
                                    it.get(Calendar.YEAR) == currentMonth.get(Calendar.YEAR)
                        } ?: false

                        CalendarDay(
                            day = dayCounter,
                            isSelected = isSelected,
                            isToday = isToday(dayCalendar),
                            hasOutfit = hasOutfitPlanned(dayCalendar),
                            onClick = { onDateSelected(dayCalendar) },
                            modifier = Modifier.weight(1f)
                        )
                        dayCounter++
                    }
                }
            }
        }
    }
}

@Composable
fun CalendarDay(
    day: Int,
    isSelected: Boolean,
    isToday: Boolean,
    hasOutfit: Boolean,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier
            .aspectRatio(1f)
            .padding(2.dp)
            .clip(CircleShape)
            .background(
                when {
                    isSelected -> BrandIndigo
                    isToday -> BrandIndigo.copy(alpha = 0.1f)
                    else -> Color.Transparent
                }
            )
            .then(
                if (isToday && !isSelected) {
                    Modifier.border(1.dp, BrandIndigo, CircleShape)
                } else Modifier
            )
            .clickable(onClick = onClick),
        contentAlignment = Alignment.Center
    ) {
        Column(
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(
                text = day.toString(),
                style = MaterialTheme.typography.bodyMedium,
                color = when {
                    isSelected -> Color.White
                    else -> MaterialTheme.colorScheme.onSurface
                },
                fontWeight = if (isToday || isSelected) FontWeight.Bold else FontWeight.Normal
            )
            if (hasOutfit) {
                Spacer(modifier = Modifier.height(2.dp))
                Box(
                    modifier = Modifier
                        .size(4.dp)
                        .clip(CircleShape)
                        .background(if (isSelected) Color.White else AccentAmber)
                )
            }
        }
    }
}

@Composable
fun SelectedDaySection(
    date: Calendar,
    entry: OutfitCalendarEntry?,
    onPlanOutfit: () -> Unit,
    onMarkWorn: (String) -> Unit
) {
    val dateFormat = SimpleDateFormat("EEEE, MMMM d", Locale.getDefault())

    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp)
    ) {
        Column(
            modifier = Modifier.padding(16.dp)
        ) {
            Text(
                text = dateFormat.format(date.time),
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(16.dp))

            if (entry != null && entry.outfit != null) {
                // Show planned outfit
                PlannedOutfitCard(
                    entry = entry,
                    onMarkWorn = { onMarkWorn(entry.id) }
                )
            } else {
                // No outfit planned
                EmptyDayCard(onPlanOutfit = onPlanOutfit)
            }
        }
    }
}

@Composable
fun PlannedOutfitCard(
    entry: OutfitCalendarEntry,
    onMarkWorn: () -> Unit
) {
    Column {
        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(
                    Icons.Default.Checkroom,
                    contentDescription = null,
                    tint = BrandIndigo,
                    modifier = Modifier.size(24.dp)
                )
                Spacer(modifier = Modifier.width(12.dp))
                Column {
                    Text(
                        text = entry.outfit?.name ?: "Outfit",
                        style = MaterialTheme.typography.titleSmall,
                        fontWeight = FontWeight.Medium
                    )
                    entry.occasion?.let {
                        Text(
                            text = it.replaceFirstChar { c -> c.uppercase() },
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }

            if (entry.wasWorn) {
                AssistChip(
                    onClick = { },
                    label = { Text("Worn") },
                    leadingIcon = {
                        Icon(
                            Icons.Default.Check,
                            contentDescription = null,
                            modifier = Modifier.size(16.dp)
                        )
                    }
                )
            } else {
                Button(
                    onClick = onMarkWorn,
                    colors = ButtonDefaults.buttonColors(
                        containerColor = SuccessGreen
                    )
                ) {
                    Icon(
                        Icons.Default.Check,
                        contentDescription = null,
                        modifier = Modifier.size(18.dp)
                    )
                    Spacer(modifier = Modifier.width(4.dp))
                    Text("Mark Worn")
                }
            }
        }

        // Show outfit items preview
        entry.outfit?.items?.let { items ->
            if (items.isNotEmpty()) {
                Spacer(modifier = Modifier.height(12.dp))
                Row(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items.take(4).forEach { item ->
                        AsyncImage(
                            model = item.imageUrl,
                            contentDescription = item.name,
                            modifier = Modifier
                                .size(48.dp)
                                .clip(RoundedCornerShape(8.dp)),
                            contentScale = ContentScale.Crop
                        )
                    }
                    if (items.size > 4) {
                        Box(
                            modifier = Modifier
                                .size(48.dp)
                                .clip(RoundedCornerShape(8.dp))
                                .background(Gray200),
                            contentAlignment = Alignment.Center
                        ) {
                            Text(
                                text = "+${items.size - 4}",
                                style = MaterialTheme.typography.bodySmall,
                                color = Gray600
                            )
                        }
                    }
                }
            }
        }

        entry.notes?.let { notes ->
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = notes,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
fun EmptyDayCard(onPlanOutfit: () -> Unit) {
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Icon(
            Icons.Default.CalendarMonth,
            contentDescription = null,
            modifier = Modifier.size(48.dp),
            tint = Gray400
        )
        Spacer(modifier = Modifier.height(12.dp))
        Text(
            text = "No outfit planned",
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
        Spacer(modifier = Modifier.height(16.dp))
        Button(onClick = onPlanOutfit) {
            Icon(Icons.Default.Add, contentDescription = null)
            Spacer(modifier = Modifier.width(8.dp))
            Text("Plan Outfit")
        }
    }
}

@Composable
fun EmptySelectionHint() {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp),
        colors = CardDefaults.cardColors(
            containerColor = Gray100
        )
    ) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Icon(
                Icons.Default.TouchApp,
                contentDescription = null,
                modifier = Modifier.size(48.dp),
                tint = BrandIndigo.copy(alpha = 0.5f)
            )
            Spacer(modifier = Modifier.height(12.dp))
            Text(
                text = "Select a date",
                style = MaterialTheme.typography.titleSmall,
                fontWeight = FontWeight.Medium
            )
            Text(
                text = "Tap on a day to view or plan outfits",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PlanOutfitSheet(
    outfits: List<Outfit>,
    onDismiss: () -> Unit,
    onSelectOutfit: (String) -> Unit
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
                text = "Select Outfit",
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Bold
            )

            Spacer(modifier = Modifier.height(16.dp))

            if (outfits.isEmpty()) {
                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Icon(
                        Icons.Default.Checkroom,
                        contentDescription = null,
                        modifier = Modifier.size(64.dp),
                        tint = Gray400
                    )
                    Spacer(modifier = Modifier.height(16.dp))
                    Text(
                        text = "No outfits saved yet",
                        style = MaterialTheme.typography.titleSmall
                    )
                    Text(
                        text = "Create an outfit first to plan it on the calendar",
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        textAlign = TextAlign.Center
                    )
                }
            } else {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    items(outfits) { outfit ->
                        OutfitSelectionCard(
                            outfit = outfit,
                            onClick = { onSelectOutfit(outfit.id) }
                        )
                    }
                }
            }

            Spacer(modifier = Modifier.height(32.dp))
        }
    }
}

@Composable
fun OutfitSelectionCard(
    outfit: Outfit,
    onClick: () -> Unit
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            // Outfit items preview
            Row(
                horizontalArrangement = Arrangement.spacedBy((-8).dp)
            ) {
                outfit.items.take(3).forEach { item ->
                    AsyncImage(
                        model = item.imageUrl,
                        contentDescription = null,
                        modifier = Modifier
                            .size(40.dp)
                            .clip(CircleShape)
                            .border(2.dp, Color.White, CircleShape),
                        contentScale = ContentScale.Crop
                    )
                }
            }

            Spacer(modifier = Modifier.width(12.dp))

            Column(modifier = Modifier.weight(1f)) {
                Text(
                    text = outfit.name ?: "Outfit",
                    style = MaterialTheme.typography.titleSmall,
                    fontWeight = FontWeight.Medium
                )
                outfit.occasion?.let {
                    Text(
                        text = it.replaceFirstChar { c -> c.uppercase() },
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Icon(
                Icons.Default.ChevronRight,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}
