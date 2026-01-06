package com.styloai.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage

@Composable
fun InitialWardrobeScreen(
    onStartDigitizing: () -> Unit,
    onExploreLater: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.White)
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState()),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            // Top Progress area
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(top = 32.dp, bottom = 16.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                    Box(modifier = Modifier.size(height = 6.dp, width = 32.dp).clip(CircleShape).background(Color(0xFF9134EF)))
                    Box(modifier = Modifier.size(6.dp).clip(CircleShape).background(Color(0xFFE5E7EB)))
                    Box(modifier = Modifier.size(6.dp).clip(CircleShape).background(Color(0xFFE5E7EB)))
                }
                Spacer(modifier = Modifier.height(16.dp))
                Text(
                    "STEP 1: THE FOUNDATION",
                    style = MaterialTheme.typography.labelSmall,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color(0xFF9134EF),
                    letterSpacing = 2.sp
                )
            }

            // Headline
            Text(
                "Your Dream Wardrobe Starts Here",
                style = MaterialTheme.typography.headlineLarge,
                fontWeight = FontWeight.ExtraBold,
                textAlign = TextAlign.Center,
                lineHeight = 40.sp,
                modifier = Modifier.padding(horizontal = 32.dp, vertical = 8.dp)
            )

            // Visual Center Piece with Glow
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp),
                contentAlignment = Alignment.Center
            ) {
                // Glow
                Box(
                    modifier = Modifier
                        .size(200.dp)
                        .background(Color(0xFF9134EF).copy(alpha = 0.2f), CircleShape)
                        .scale(1.5f) // Custom scale logic
                )
                
                Card(
                    modifier = Modifier
                        .fillMaxWidth()
                        .aspectRatio(4/3f)
                        .shadow(4.dp, RoundedCornerShape(24.dp)),
                    shape = RoundedCornerShape(24.dp)
                ) {
                    AsyncImage(
                        model = "https://lh3.googleusercontent.com/aida-public/AB6AXuAUSxkdNmga0dsqh8GcmhXcNbtX_R5CMit6DMrT9PI9yy1I40-8UPvfyn0G0_aR6FGPIxx2NF7CZclF-bsds5Shw6wDCPZDhe-CJOQAbdOiLpmycCQPCj_R1lv94R4AXeKapa5xCqBe17tyB5SUszKDtItITcmR81Am_L_NnjDOYVYBl0zVOZFVtAmOc2E839-4XU2FmykR6AzOPbXoE-FziBoUM4vxBbhS_oQ9ygZru38oHx8OjdjxqkAQXFjW1WA46dBW-FU2E48",
                        contentDescription = null,
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )
                }
            }

            Text(
                "Upload just 3 items to unlock personalized AI outfit recommendations instantly.",
                style = MaterialTheme.typography.bodyMedium,
                color = Color.Gray,
                textAlign = TextAlign.Center,
                modifier = Modifier.padding(horizontal = 48.dp, vertical = 8.dp)
            )

            Spacer(modifier = Modifier.height(24.dp))

            // Benefit Items
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 32.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                BenefitItem(
                    title = "Instant Style",
                    description = "Get outfits created for you automatically.",
                    icon = Icons.Default.AutoAwesome
                )
                BenefitItem(
                    title = "Organize",
                    description = "Never lose track of your favorite pieces.",
                    icon = Icons.Default.Checkroom
                )
                BenefitItem(
                    title = "Sustainability",
                    description = "Wear more of what you own.",
                    icon = Icons.Default.Recycling
                )
            }

            Spacer(modifier = Modifier.height(140.dp)) // Space for floating button
        }

        // Floating Bottom Actions
        Box(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .fillMaxWidth()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(Color.White.copy(alpha = 0f), Color.White, Color.White)
                    )
                )
                .padding(32.dp)
        ) {
            Column(horizontalAlignment = Alignment.CenterHorizontally) {
                Button(
                    onClick = onStartDigitizing,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(64.dp)
                        .shadow(12.dp, RoundedCornerShape(32.dp), spotColor = Color(0xFF9134EF).copy(alpha = 0.3f)),
                    shape = RoundedCornerShape(32.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF9134EF))
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Icon(Icons.Default.AddAPhoto, null, modifier = Modifier.size(20.dp))
                        Spacer(modifier = Modifier.width(12.dp))
                        Text("Start Digitizing", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                    }
                }
                
                TextButton(
                    onClick = onExploreLater,
                    modifier = Modifier.padding(top = 12.dp)
                ) {
                    Text("Explore app first (add items later)", color = Color.Gray)
                }
            }
        }
    }
}

@Composable
fun BenefitItem(title: String, description: String, icon: ImageVector) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(20.dp))
            .background(Color(0xFFF9FAFB))
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(48.dp)
                .background(Color(0xFF9134EF).copy(alpha = 0.1f), CircleShape),
            contentAlignment = Alignment.Center
        ) {
            Icon(icon, null, tint = Color(0xFF9134EF), modifier = Modifier.size(24.dp))
        }
        Spacer(modifier = Modifier.width(16.dp))
        Column {
            Text(title, fontWeight = FontWeight.Bold, fontSize = 16.sp)
            Text(description, fontSize = 13.sp, color = Color.Gray)
        }
    }
}

private fun Modifier.scale(scale: Float) = this.then(Modifier.size((52 * scale).dp, (32 * scale).dp))
