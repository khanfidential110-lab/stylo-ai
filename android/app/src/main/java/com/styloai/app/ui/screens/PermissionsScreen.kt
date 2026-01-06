package com.styloai.app.ui.screens

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material.icons.outlined.PhotoCamera
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage

@Composable
fun PermissionsScreen(
    onGrant: () -> Unit,
    onSkip: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF6F6F8)) // background-light
    ) {
        // Header Image Area
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .height(260.dp)
                .background(
                    Brush.verticalGradient(
                        colors = listOf(Color(0xFF9134EF).copy(alpha = 0.1f), Color.Transparent)
                    )
                ),
            contentAlignment = Alignment.Center
        ) {
            // Background Pattern/Image
            AsyncImage(
                model = "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=2070&auto=format&fit=crop",
                contentDescription = null,
                modifier = Modifier
                    .fillMaxSize()
                    .alpha(0.1f),
                contentScale = ContentScale.Crop
            )
            
            // Security Icon
            Box(
                modifier = Modifier
                    .size(96.dp)
                    .shadow(20.dp, CircleShape, spotColor = Color(0xFF9134EF).copy(alpha = 0.1f))
                    .background(Color.White, CircleShape),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    Icons.Default.Security,
                    contentDescription = null,
                    modifier = Modifier.size(48.dp),
                    tint = Color(0xFF9134EF)
                )
            }
        }

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 32.dp)
                .padding(top = 240.dp, bottom = 32.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Headlines
            Text(
                "Let's personalize your style",
                style = MaterialTheme.typography.headlineMedium,
                fontWeight = FontWeight.Bold,
                textAlign = TextAlign.Center,
                color = Color(0xFF111118)
            )
            
            Spacer(modifier = Modifier.height(12.dp))
            
            Text(
                "To give you the best outfit recommendations, STYLO AI needs access to a few things.",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.Gray,
                textAlign = TextAlign.Center
            )

            Spacer(modifier = Modifier.height(40.dp))

            // Permission Items
            Column(verticalArrangement = Arrangement.spacedBy(24.dp)) {
                PermissionItem(
                    title = "Digitize Your Closet",
                    subtitle = "Camera Access",
                    description = "Scan clothes and get AI outfit analysis.",
                    icon = Icons.Outlined.PhotoCamera
                )
                PermissionItem(
                    title = "Daily Inspiration",
                    subtitle = "Notifications",
                    description = "Get morning outfit picks and laundry reminders.",
                    icon = Icons.Default.Notifications
                )
                PermissionItem(
                    title = "Weather-Ready Fits",
                    subtitle = "Location",
                    description = "Recommendations based on your local forecast.",
                    icon = Icons.Default.LocationOn
                )
            }

            Spacer(modifier = Modifier.weight(1f))

            // Buttons
            Button(
                onClick = onGrant,
                modifier = Modifier
                    .fillMaxWidth()
                    .height(64.dp)
                    .shadow(12.dp, RoundedCornerShape(32.dp), spotColor = Color(0xFF9134EF).copy(alpha = 0.3f)),
                shape = RoundedCornerShape(32.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF9134EF))
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text("Enable Permissions", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    Spacer(modifier = Modifier.width(8.dp))
                    Icon(Icons.Default.ArrowForward, null, modifier = Modifier.size(18.dp))
                }
            }
            
            TextButton(
                onClick = onSkip,
                modifier = Modifier.padding(top = 8.dp)
            ) {
                Text("Skip for now", color = Color.Gray, fontWeight = FontWeight.Medium)
            }
            
            Text(
                "You can manage these permissions later in Settings.",
                style = MaterialTheme.typography.labelSmall,
                color = Color.LightGray,
                modifier = Modifier.padding(top = 8.dp)
            )
        }
    }
}

@Composable
fun PermissionItem(
    title: String,
    subtitle: String,
    description: String,
    icon: ImageVector
) {
    var isEnabled by remember { mutableStateOf(true) }
    
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(Color.White)
            .padding(16.dp),
        verticalAlignment = Alignment.Top,
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        Box(
            modifier = Modifier
                .size(48.dp)
                .background(Color(0xFF9134EF).copy(alpha = 0.1f), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(icon, null, tint = Color(0xFF9134EF), modifier = Modifier.size(24.dp))
        }
        
        Column(modifier = Modifier.weight(1f)) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(title, fontWeight = FontWeight.Bold, fontSize = 16.sp)
                Switch(
                    checked = isEnabled,
                    onCheckedChange = { isEnabled = it },
                    colors = SwitchDefaults.colors(
                        checkedThumbColor = Color.White,
                        checkedTrackColor = Color(0xFF9134EF),
                        uncheckedTrackColor = Color(0xFFE5E7EB),
                        uncheckedBorderColor = Color.Transparent
                    ),
                    modifier = Modifier.scale(0.8f) // Make it slightly smaller
                )
            }
            Text(subtitle, fontSize = 12.sp, color = Color.Gray, fontWeight = FontWeight.Medium)
            Text(description, fontSize = 12.sp, color = Color.LightGray, lineHeight = 16.sp, modifier = Modifier.padding(top = 4.dp))
        }
    }
}

private fun Modifier.scale(scale: Float) = this.then(Modifier.size((52 * scale).dp, (32 * scale).dp))
private fun Modifier.alpha(alpha: Float) = this.then(Modifier.graphicsLayer(alpha = alpha))
