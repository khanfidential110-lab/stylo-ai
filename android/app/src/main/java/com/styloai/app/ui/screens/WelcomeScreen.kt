package com.styloai.app.ui.screens

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material.icons.filled.Checkroom
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp

@Composable
fun WelcomeScreen(
    onGetStarted: () -> Unit,
    onLogin: () -> Unit
) {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF6F6F8)) // background-light
    ) {
        // Background Blurs
        Box(
            modifier = Modifier
                .offset(x = 100.dp, y = (-50).dp)
                .size(400.dp)
                .background(Color(0xFF3B3FF1).copy(alpha = 0.1f), CircleShape)
                .clip(CircleShape)
        )
        Box(
            modifier = Modifier
                .align(Alignment.BottomStart)
                .offset(x = (-100).dp, y = 50.dp)
                .size(350.dp)
                .background(Color(0xFF60A5FA).copy(alpha = 0.1f), CircleShape)
                .clip(CircleShape)
        )

        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(32.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Top Logo Section
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.padding(top = 48.dp)
            ) {
                Box(
                    modifier = Modifier
                        .size(96.dp)
                        .rotate(3f)
                        .shadow(20.dp, RoundedCornerShape(24.dp), spotColor = Color(0xFF3B3FF1).copy(alpha = 0.3f))
                        .background(Color(0xFF3B3FF1), RoundedCornerShape(24.dp)),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(
                        Icons.Default.Checkroom,
                        contentDescription = null,
                        modifier = Modifier.size(48.dp),
                        tint = Color.White
                    )
                }
                
                Spacer(modifier = Modifier.height(24.dp))
                
                Text(
                    "STYLO AI",
                    style = MaterialTheme.typography.headlineMedium,
                    fontWeight = FontWeight.ExtraBold,
                    color = Color(0xFF111118)
                )
                
                Box(
                    modifier = Modifier
                        .size(width = 48.dp, height = 4.dp)
                        .background(Color(0xFF3B3FF1), CircleShape)
                )
            }

            // Visual Center Piece
            Box(
                modifier = Modifier
                    .size(280.dp)
                    .clip(RoundedCornerShape(40.dp))
                    .background(
                        Brush.linearGradient(
                            colors = listOf(Color(0xFFDBEAFE), Color.White)
                        )
                    )
                    .shadow(10.dp, RoundedCornerShape(40.dp)),
                contentAlignment = Alignment.Center
            ) {
                // Floating Icons
                Box(
                    modifier = Modifier
                        .offset(x = (-20).dp, y = 10.dp)
                        .rotate(-6f)
                        .shadow(12.dp, RoundedCornerShape(16.dp))
                        .background(Color.White, RoundedCornerShape(16.dp))
                        .padding(16.dp)
                ) {
                    Icon(Icons.Default.AutoAwesome, null, tint = Color(0xFF3B3FF1), modifier = Modifier.size(36.dp))
                }
                
                Box(
                    modifier = Modifier
                        .offset(x = 30.dp, y = (-20).dp)
                        .rotate(6f)
                        .shadow(12.dp, RoundedCornerShape(16.dp))
                        .background(Color.White, RoundedCornerShape(16.dp))
                        .padding(16.dp)
                ) {
                    Icon(Icons.Default.Checkroom, null, tint = Color(0xFFA855F7), modifier = Modifier.size(36.dp))
                }
            }

            // Text Content
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    "Simplify Your Style",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold,
                    textAlign = TextAlign.Center
                )
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Text(
                    "Let AI curate your perfect wardrobe. Discover outfits that match your unique taste instantly.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color.Gray,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.padding(horizontal = 24.dp)
                )
            }

            // Buttons
            Column(
                modifier = Modifier.fillMaxWidth(),
                verticalArrangement = Arrangement.spacedBy(16.dp)
            ) {
                Button(
                    onClick = onGetStarted,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(64.dp)
                        .shadow(10.dp, RoundedCornerShape(20.dp), spotColor = Color(0xFF3B3FF1).copy(alpha = 0.25f)),
                    shape = RoundedCornerShape(20.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3B3FF1))
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text("Get Started", fontWeight = FontWeight.Bold, fontSize = 18.sp)
                        Spacer(modifier = Modifier.width(8.dp))
                        Icon(Icons.Default.ArrowForward, contentDescription = null, modifier = Modifier.size(18.dp))
                    }
                }
                
                OutlinedButton(
                    onClick = onLogin,
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(64.dp),
                    shape = RoundedCornerShape(20.dp),
                    border = androidx.compose.foundation.BorderStroke(1.dp, Color(0xFFE5E7EB)),
                    colors = ButtonDefaults.outlinedButtonColors(contentColor = Color(0xFF111118))
                ) {
                    Text("I already have an account", fontWeight = FontWeight.Bold, fontSize = 16.sp)
                }
                
                Text(
                    text = "By continuing, you agree to our Terms & Privacy Policy",
                    style = MaterialTheme.typography.labelSmall,
                    color = Color.LightGray,
                    textAlign = TextAlign.Center,
                    modifier = Modifier.fillMaxWidth().padding(top = 8.dp)
                )
            }
        }
    }
}
