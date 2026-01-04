package com.styloai.app.ui.screens.chat

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.lazy.rememberLazyListState
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
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import com.styloai.app.data.model.DisplayMessage
import com.styloai.app.data.model.MessageRole
import com.styloai.app.data.model.QuickAction
import com.styloai.app.ui.theme.*
import java.text.SimpleDateFormat
import java.util.*

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ChatScreen(
    viewModel: ChatViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()
    val listState = rememberLazyListState()

    // Auto-scroll to bottom when new messages arrive
    LaunchedEffect(uiState.messages.size) {
        if (uiState.messages.isNotEmpty()) {
            listState.animateScrollToItem(uiState.messages.size - 1)
        }
    }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Style Assistant") },
                actions = {
                    IconButton(onClick = { }) {
                        Icon(Icons.Default.MoreVert, contentDescription = "Menu")
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
            // Messages list
            LazyColumn(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth(),
                state = listState,
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                items(uiState.messages) { message ->
                    MessageBubble(
                        message = message,
                        onQuickAction = { action ->
                            viewModel.handleQuickAction(action)
                        }
                    )
                }

                if (uiState.isLoading) {
                    item {
                        TypingIndicator()
                    }
                }
            }

            HorizontalDivider()

            // Input bar
            ChatInputBar(
                text = uiState.inputText,
                onTextChange = { viewModel.updateInputText(it) },
                onSend = { viewModel.sendMessage() },
                isLoading = uiState.isLoading
            )
        }
    }
}

@Composable
fun MessageBubble(
    message: DisplayMessage,
    onQuickAction: (String) -> Unit
) {
    val isUser = message.role == MessageRole.USER

    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = if (isUser) Alignment.End else Alignment.Start
    ) {
        Box(
            modifier = Modifier
                .widthIn(max = 280.dp)
                .clip(
                    RoundedCornerShape(
                        topStart = 16.dp,
                        topEnd = 16.dp,
                        bottomStart = if (isUser) 16.dp else 4.dp,
                        bottomEnd = if (isUser) 4.dp else 16.dp
                    )
                )
                .background(if (isUser) BrandIndigo else Gray100)
                .padding(12.dp)
        ) {
            Text(
                text = message.content,
                color = if (isUser) Color.White else MaterialTheme.colorScheme.onSurface,
                style = MaterialTheme.typography.bodyMedium
            )
        }

        // Quick actions
        message.quickActions?.let { actions ->
            if (actions.isNotEmpty() && !isUser) {
                Spacer(modifier = Modifier.height(8.dp))
                LazyRow(
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    items(actions) { action ->
                        AssistChip(
                            onClick = { onQuickAction(action.action) },
                            label = { Text(action.label, style = MaterialTheme.typography.labelSmall) }
                        )
                    }
                }
            }
        }

        // Timestamp
        Spacer(modifier = Modifier.height(4.dp))
        Text(
            text = formatTimestamp(message.timestamp),
            style = MaterialTheme.typography.labelSmall,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )
    }
}

@Composable
fun TypingIndicator() {
    Row(
        modifier = Modifier
            .clip(RoundedCornerShape(16.dp))
            .background(Gray100)
            .padding(horizontal = 16.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.spacedBy(4.dp)
    ) {
        repeat(3) { index ->
            Box(
                modifier = Modifier
                    .size(8.dp)
                    .clip(CircleShape)
                    .background(Gray400)
            )
        }
    }
}

@Composable
fun ChatInputBar(
    text: String,
    onTextChange: (String) -> Unit,
    onSend: () -> Unit,
    isLoading: Boolean
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 16.dp, vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        // Attachment button
        IconButton(onClick = { }) {
            Icon(
                Icons.Default.Image,
                contentDescription = "Attach image",
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }

        // Text field
        OutlinedTextField(
            value = text,
            onValueChange = onTextChange,
            modifier = Modifier.weight(1f),
            placeholder = { Text("Ask me anything...") },
            shape = RoundedCornerShape(24.dp),
            maxLines = 4,
            colors = OutlinedTextFieldDefaults.colors(
                focusedBorderColor = BrandIndigo,
                unfocusedBorderColor = Gray300
            )
        )

        // Send button
        IconButton(
            onClick = onSend,
            enabled = text.isNotBlank() && !isLoading,
            modifier = Modifier
                .size(48.dp)
                .clip(CircleShape)
                .background(
                    if (text.isNotBlank() && !isLoading) BrandIndigo else Gray300
                )
        ) {
            Icon(
                Icons.Default.ArrowUpward,
                contentDescription = "Send",
                tint = Color.White
            )
        }
    }
}

private fun formatTimestamp(timestamp: Long): String {
    val sdf = SimpleDateFormat("h:mm a", Locale.getDefault())
    return sdf.format(Date(timestamp))
}
