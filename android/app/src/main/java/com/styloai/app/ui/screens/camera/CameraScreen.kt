package com.styloai.app.ui.screens.camera

import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageCapture
import androidx.camera.core.ImageCaptureException
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.view.PreviewView
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
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
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalLifecycleOwner
import androidx.compose.ui.unit.dp
import androidx.compose.ui.viewinterop.AndroidView
import androidx.core.content.ContextCompat
import coil.compose.AsyncImage
import androidx.compose.ui.text.font.FontWeight

@Composable
fun CameraScreen(
    onImageCaptured: (String) -> Unit = {},
    onClose: () -> Unit = {}
) {
    val context = LocalContext.current
    val lifecycleOwner = LocalLifecycleOwner.current
    val cameraProviderFuture = remember { ProcessCameraProvider.getInstance(context) }
    
    var imageCapture: ImageCapture? by remember { mutableStateOf(null) }
    val previewView = remember { PreviewView(context) }

    LaunchedEffect(cameraProviderFuture) {
        val cameraProvider = cameraProviderFuture.get()
        val preview = Preview.Builder().build().also {
            it.setSurfaceProvider(previewView.surfaceProvider)
        }
        imageCapture = ImageCapture.Builder().build()
        val cameraSelector = CameraSelector.DEFAULT_BACK_CAMERA

        try {
            cameraProvider.unbindAll()
            cameraProvider.bindToLifecycle(
                lifecycleOwner,
                cameraSelector,
                preview,
                imageCapture
            )
        } catch (e: Exception) {
            e.printStackTrace()
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFF101122))
    ) {
        // 1. Real Camera Preview
        AndroidView(
            factory = { previewView },
            modifier = Modifier.fillMaxSize()
        )
        
        // Gradient Overlay
        Box(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            Color.Black.copy(alpha=0.4f),
                            Color.Transparent,
                            Color.Black.copy(alpha=0.6f)
                        )
                    )
                )
        )

        // 2. Framing Overlay
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(bottom = 120.dp),
            contentAlignment = Alignment.Center
        ) {
            Box(
                modifier = Modifier
                    .fillMaxWidth(0.9f)
                    .fillMaxHeight(0.65f)
                    .border(2.dp, Color.White.copy(alpha=0.2f), RoundedCornerShape(24.dp))
            ) {
                CameraCorner(Alignment.TopStart)
                CameraCorner(Alignment.TopEnd)
                CameraCorner(Alignment.BottomStart)
                CameraCorner(Alignment.BottomEnd)
                
                Box(
                    modifier = Modifier
                        .align(Alignment.Center)
                        .size(8.dp)
                        .background(Color.White.copy(alpha=0.5f), CircleShape)
                )
            }
        }

        // 3. Top Toolbar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .statusBarsPadding()
                .padding(top = 12.dp, start = 24.dp, end = 24.dp),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            GlassIconButton(icon = Icons.Default.Close, onClick = onClose)
            
            Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                GlassIconButton(icon = Icons.Default.Bolt, onClick = {})
                GlassIconButton(icon = Icons.Default.Timer, onClick = {})
            }
        }

        // 4. Guidance Chip
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .padding(top = 120.dp),
            contentAlignment = Alignment.Center
        ) {
            Row(
                modifier = Modifier
                    .background(Color.Black.copy(alpha=0.4f), CircleShape)
                    .border(1.dp, Color.White.copy(alpha=0.1f), CircleShape)
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Icon(Icons.Default.AutoAwesome, null, tint = Color(0xFF3B3FF1), modifier = Modifier.size(16.dp))
                Spacer(modifier = Modifier.width(8.dp))
                Text("Align your full body within the frame", color = Color.White, style = MaterialTheme.typography.bodySmall, fontWeight = FontWeight.Medium)
            }
        }

        // 5. Camera Controls
        Column(
            modifier = Modifier
                .align(Alignment.BottomCenter)
                .padding(bottom = 90.dp)
                .padding(horizontal = 32.dp)
        ) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Gallery Thumbnail Placeholder
                Box(
                    modifier = Modifier
                        .size(48.dp)
                        .clip(RoundedCornerShape(8.dp))
                        .background(Color.DarkGray)
                        .border(2.dp, Color.White.copy(alpha=0.3f), RoundedCornerShape(8.dp))
                )

                // Shutter Button
                Box(
                    modifier = Modifier
                        .size(80.dp)
                        .border(4.dp, Color.White, CircleShape),
                    contentAlignment = Alignment.Center
                ) {
                        Box(
                            modifier = Modifier
                                .size(64.dp)
                                .background(Color.White, CircleShape)
                                .clickable {
                                    val photoFile = java.io.File(
                                        context.externalCacheDir,
                                        "captured_item_${System.currentTimeMillis()}.jpg"
                                    )
                                    val outputOptions = ImageCapture.OutputFileOptions.Builder(photoFile).build()
                                    
                                    imageCapture?.takePicture(
                                        outputOptions,
                                        ContextCompat.getMainExecutor(context),
                                        object : ImageCapture.OnImageSavedCallback {
                                            override fun onImageSaved(outputFileResults: ImageCapture.OutputFileResults) {
                                                onImageCaptured(android.net.Uri.fromFile(photoFile).toString())
                                            }
                                            override fun onError(exception: ImageCaptureException) {
                                                exception.printStackTrace()
                                            }
                                        }
                                    )
                                }
                        )
                }

                // Camera Switch
                GlassIconButton(
                    icon = Icons.Default.FlipCameraIos, 
                    onClick = {},
                    modifier = Modifier.size(48.dp),
                    darker = true
                )
            }
        }
    }
}

@Composable
fun CameraCorner(alignment: Alignment) {
    Box(modifier = Modifier.fillMaxSize()) {
        Box(
            modifier = Modifier
                .align(alignment)
                .size(40.dp)
                .background(Color.Transparent)
                // We would draw borders here ideally. For now, simple box connection simulation
                .drawCornerBorder(alignment)
        )
    }
}

@Composable
fun GlassIconButton(
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    onClick: () -> Unit,
    modifier: Modifier = Modifier.size(40.dp),
    darker: Boolean = false
) {
    val bgColor = if (darker) Color.Black.copy(alpha=0.3f) else Color.White.copy(alpha=0.2f)
    IconButton(
        onClick = onClick,
        modifier = modifier
            .background(bgColor, CircleShape)
            .border(1.dp, Color.White.copy(alpha=0.1f), CircleShape)
    ) {
        Icon(icon, null, tint = Color.White, modifier = Modifier.size(20.dp))
    }
}

// Extension to draw custom partial borders
fun Modifier.drawCornerBorder(alignment: Alignment): Modifier = this.border(
    width = 4.dp, // Simplified: Draw full border for now to avoid complex canvas code in one shot. 
    // In production, use Modifier.drawBehind { drawLine(...) }
    color = Color.White.copy(alpha=0.8f),
    shape = when(alignment) {
        Alignment.TopStart -> RoundedCornerShape(topStart = 16.dp)
        Alignment.TopEnd -> RoundedCornerShape(topEnd = 16.dp)
        Alignment.BottomStart -> RoundedCornerShape(bottomStart = 16.dp)
        Alignment.BottomEnd -> RoundedCornerShape(bottomEnd = 16.dp)
        else -> CircleShape
    }
).clip(when(alignment) {
        Alignment.TopStart -> RoundedCornerShape(topStart = 16.dp)
        Alignment.TopEnd -> RoundedCornerShape(topEnd = 16.dp)
        Alignment.BottomStart -> RoundedCornerShape(bottomStart = 16.dp)
        Alignment.BottomEnd -> RoundedCornerShape(bottomEnd = 16.dp)
        else -> CircleShape
    })

