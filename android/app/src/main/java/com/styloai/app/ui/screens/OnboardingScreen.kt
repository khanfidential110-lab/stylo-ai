package com.styloai.app.ui.screens

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.CheckCircle
import androidx.compose.material.icons.filled.Checkroom
import androidx.compose.material.icons.filled.DateRange
import androidx.compose.material.icons.filled.ArrowForward
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.styloai.app.R
import com.styloai.app.ui.components.StyloButton
import kotlinx.coroutines.launch

data class OnboardingPage(
    val title: String,
    val description: String,
    val imageRes: Int // Pass logic to use real images or placeholders
)

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun OnboardingScreen(
    onComplete: () -> Unit,
    onSkip: () -> Unit
) {
    val pages = listOf(
        OnboardingPage(
            title = "Digitize Your Wardrobe",
            description = "Instantly add clothes by snapping a photo. Our AI automatically removes backgrounds and categorizes your items for effortless organization.",
            imageRes = 0 
        ),
        OnboardingPage(
            title = "Effortless Daily Style",
            description = "Wake up to personalized outfit picks. STYLO AI analyzes the forecast and your calendar to recommend the perfect look.",
            imageRes = 0
        ),
        OnboardingPage(
            title = "Your Personal AI Stylist",
            description = "Chat anytime for instant outfit advice, trend tips, and personalized styling recommendations.",
            imageRes = 0
        )
    )

    val pagerState = rememberPagerState(pageCount = { pages.size })
    val scope = rememberCoroutineScope()

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFF6F6F8)) // background-light
    ) {
        // Background Blurs
        Box(
            modifier = Modifier
                .offset(x = (-50).dp, y = 200.dp)
                .size(300.dp)
                .background(Color(0xFF3B3FF1).copy(alpha = 0.08f), CircleShape)
                .clip(CircleShape)
        )
        Box(
            modifier = Modifier
                .align(Alignment.CenterEnd)
                .offset(x = 100.dp, y = 100.dp)
                .size(250.dp)
                .background(Color(0xFFA855F7).copy(alpha = 0.08f), CircleShape)
                .clip(CircleShape)
        )

        Column(modifier = Modifier.fillMaxSize()) {
            // Header: Skip
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 24.dp)
                    .padding(top = 48.dp),
                horizontalArrangement = Arrangement.End
            ) {
                Text(
                    "Skip",
                    modifier = Modifier.clickable(onClick = onSkip),
                    style = MaterialTheme.typography.labelLarge,
                    fontWeight = FontWeight.Bold,
                    color = Color.Gray
                )
            }

            HorizontalPager(
                state = pagerState,
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
            ) { pageIndex ->
                OnboardingPageContent(page = pages[pageIndex])
            }

            // Bottom Section
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(24.dp)
                    .padding(bottom = 32.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                // Indicators
                Row(
                    modifier = Modifier.padding(bottom = 32.dp),
                    horizontalArrangement = Arrangement.Center,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    repeat(pagerState.pageCount) { iteration ->
                        val isActive = pagerState.currentPage == iteration
                        Box(
                            modifier = Modifier
                                .padding(horizontal = 3.dp)
                                .clip(CircleShape)
                                .background(if (isActive) Color(0xFF3B3FF1) else Color(0xFFD1D5DB).copy(alpha = 0.5f))
                                .size(width = if (isActive) 24.dp else 6.dp, height = 6.dp)
                        )
                    }
                }

                // Next Button
                Button(
                    onClick = {
                        if (pagerState.currentPage < pages.size - 1) {
                            scope.launch {
                                pagerState.animateScrollToPage(pagerState.currentPage + 1)
                            }
                        } else {
                            onComplete()
                        }
                    },
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(64.dp)
                        .shadow(10.dp, RoundedCornerShape(20.dp), spotColor = Color(0xFF3B3FF1).copy(alpha = 0.3f)),
                    shape = RoundedCornerShape(20.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFF3B3FF1))
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            if (pagerState.currentPage == pages.size - 1) "Finish" else "Next",
                            fontWeight = FontWeight.Bold,
                            fontSize = 18.sp
                        )
                        if (pagerState.currentPage < pages.size - 1) {
                            Spacer(modifier = Modifier.width(8.dp))
                            Icon(Icons.Default.ArrowForward, null, modifier = Modifier.size(18.dp))
                        }
                    }
                }
            }
        }
    }
}

@Composable
fun OnboardingPageContent(page: OnboardingPage) {
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 32.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        when (page.title) {
            "Digitize Your Wardrobe" -> DigitizeVisual()
            "Effortless Daily Style" -> DailyStyleVisual()
            "Your Personal AI Stylist" -> AIStylistVisual()
        }
        
        Spacer(modifier = Modifier.height(32.dp))
        
        Text(
            text = page.title,
            style = MaterialTheme.typography.headlineMedium.copy(fontWeight = FontWeight.Bold),
            textAlign = TextAlign.Center,
            color = Color(0xFF111118)
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Text(
            text = page.description,
            style = MaterialTheme.typography.bodyLarge,
            textAlign = TextAlign.Center,
            color = Color.Gray,
            lineHeight = 24.sp
        )
    }
}

@Composable
fun DigitizeVisual() {
    Box(
        modifier = Modifier.size(280.dp),
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .size(220.dp)
                .clip(RoundedCornerShape(32.dp))
                .background(Brush.linearGradient(colors = listOf(Color(0xFFDBEAFE), Color(0xFFF3E8FF))))
                .border(1.dp, Color.White.copy(alpha = 0.5f), RoundedCornerShape(32.dp))
                .shadow(10.dp, RoundedCornerShape(32.dp)),
            contentAlignment = Alignment.Center
        ) {
            Box(
                modifier = Modifier
                    .size(width = 140.dp, height = 180.dp)
                    .clip(RoundedCornerShape(16.dp))
                    .background(Color.White)
                    .shadow(8.dp, RoundedCornerShape(16.dp))
            ) {
                Column {
                    AsyncImage(
                        model = "https://lh3.googleusercontent.com/aida-public/AB6AXuC2JqgDyRY3kVCFgYgNQUluq-kDGmn5FYnE6lU9iv9_o6A8SuwTXgfo3693_LvUexI6OYlV41XhK5YVe_q88-4ybGo5s4dzM50ajuGDfKwB4E1DNDgX5oWY4BG77pPs0VWGN3l-QhIINouN-cXbx-dlD9EqutrbJl-VygMDr2cnyeiuJnKnIwfhb9KDVjbbjA7QfieAYWFGAMJvUqC3aIeZG5RTQy_swsXyv-l0DqItyevQ26U7vZj46qegKWca7Id1sHty27WKnow",
                        contentDescription = null,
                        modifier = Modifier.fillMaxWidth().height(130.dp),
                        contentScale = ContentScale.Crop
                    )
                    Box(modifier = Modifier.fillMaxWidth().padding(8.dp), contentAlignment = Alignment.Center) {
                        Column(horizontalAlignment = Alignment.CenterHorizontally) {
                            Text("Red Jacket", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                            Text("OUTERWEAR", fontSize = 9.sp, color = Color.Gray)
                        }
                    }
                }
            }
        }
        Icon(
            Icons.Default.AutoAwesome, null,
            modifier = Modifier.align(Alignment.TopEnd).offset(x = 10.dp, y = (-10).dp).size(56.dp).shadow(12.dp, RoundedCornerShape(16.dp)).background(Color.White, RoundedCornerShape(16.dp)).padding(12.dp),
            tint = Color(0xFF3B3FF1)
        )
        Icon(
            Icons.Default.CheckCircle, null,
            modifier = Modifier.align(Alignment.BottomStart).offset(x = (-10).dp, y = 10.dp).size(48.dp).shadow(12.dp, RoundedCornerShape(16.dp)).background(Color.White, RoundedCornerShape(16.dp)).padding(12.dp),
            tint = Color(0xFF22C55E)
        )
    }
}

@Composable
fun DailyStyleVisual() {
    Box(
        modifier = Modifier.size(280.dp),
        contentAlignment = Alignment.Center
    ) {
        Box(
            modifier = Modifier
                .fillMaxSize()
                .clip(RoundedCornerShape(40.dp))
                .shadow(4.dp, RoundedCornerShape(40.dp))
        ) {
             AsyncImage(
                model = "https://lh3.googleusercontent.com/aida-public/AB6AXuC7NDs7cVdBMKbQoX0ySGovlMgWwpAlMobvcLyjxzLZLzjspL2IxFjXnQvxOBh0LmkYi5FH-m3exmiA41aCgsbb52-KP0eDmDKILC00yCXuavQ5RvX72u9rcAT5UoHqvZjXdNnAAVC6GaozvGLSFxo7vJjGSWnw5EY3IBMtGkPN7lVNTtNxqru7x0R6Xhkx5s4DCvepOMAvWXZlLYvtOqrpaUpWLy_ZXl4ozfzbMafJZlVxHIoiwpewY6pPtV5BQ-AhSdAiVd-r4Qc",
                contentDescription = null,
                modifier = Modifier.fillMaxSize(),
                contentScale = ContentScale.Crop
            )
        }
    }
}

@Composable
fun AIStylistVisual() {
    Box(
        modifier = Modifier.size(280.dp),
        contentAlignment = Alignment.Center
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            // User Message
            Box(
                modifier = Modifier
                    .align(Alignment.End)
                    .shadow(8.dp, RoundedCornerShape(20.dp, 4.dp, 20.dp, 20.dp))
                    .background(Color.White, RoundedCornerShape(20.dp, 4.dp, 20.dp, 20.dp))
                    .padding(horizontal = 16.dp, vertical = 12.dp)
                    .widthIn(max = 200.dp)
            ) {
                Text("I need a look for a summer wedding outdoors. ☀️", fontSize = 13.sp, fontWeight = FontWeight.Medium)
            }
            // AI Message
            Row(verticalAlignment = Alignment.Bottom, horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                Box(
                    modifier = Modifier.size(32.dp).background(Brush.linearGradient(colors = listOf(Color(0xFF3B3FF1), Color(0xFFA855F7))), CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                    Icon(Icons.Default.AutoAwesome, null, tint = Color.White, modifier = Modifier.size(16.dp))
                }
                Box(
                    modifier = Modifier
                        .shadow(8.dp, RoundedCornerShape(4.dp, 20.dp, 20.dp, 20.dp))
                        .background(Color(0xFF3B3FF1), RoundedCornerShape(4.dp, 20.dp, 20.dp, 20.dp))
                        .padding(horizontal = 16.dp, vertical = 12.dp)
                        .widthIn(max = 200.dp)
                ) {
                    Text("I found the perfect floral dress and matching accessories for you!", fontSize = 13.sp, color = Color.White, fontWeight = FontWeight.Medium)
                }
            }
        }
    }
}

// Ext helper
private fun Modifier.customAlpha(alpha: Float) = this.then(Modifier.graphicsLayer(alpha = alpha))
