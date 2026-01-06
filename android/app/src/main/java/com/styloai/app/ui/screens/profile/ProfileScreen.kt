package com.styloai.app.ui.screens.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ExitToApp
import androidx.compose.material.icons.filled.ArrowBack
import androidx.compose.material.icons.filled.Add
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.ui.draw.shadow
import androidx.compose.ui.unit.dp
import androidx.hilt.navigation.compose.hiltViewModel
import coil.compose.AsyncImage
import com.styloai.app.data.model.SubscriptionTier
import com.styloai.app.data.model.User
import com.styloai.app.ui.theme.*
import com.styloai.app.ui.components.StyloCard
import com.styloai.app.ui.components.StyloButton
import kotlinx.coroutines.launch

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    viewModel: ProfileViewModel = hiltViewModel(),
    onLogout: () -> Unit
) {
    val uiState by viewModel.uiState.collectAsState()
    val error by viewModel.error.collectAsState(initial = null)
    val loading by viewModel.loading.collectAsState()
    
    val snackbarHostState = remember { SnackbarHostState() }
    val scope = rememberCoroutineScope()

    LaunchedEffect(error) {
        error?.let {
            snackbarHostState.showSnackbar(it)
        }
    }

    Scaffold(
        snackbarHost = { SnackbarHost(snackbarHostState) },
        topBar = {
            CenterAlignedTopAppBar(
                title = { 
                    Text(
                        "My Profile",
                        fontWeight = FontWeight.ExtraBold,
                        style = MaterialTheme.typography.titleMedium
                    ) 
                },
                actions = {
                    TextButton(onClick = { scope.launch { snackbarHostState.showSnackbar("Edit Profile coming soon!") } }) {
                        Text("Edit", color = Color(0xFF3B3FF1), fontWeight = FontWeight.Bold)
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = Color.White
                )
            )
        }
    ) { paddingValues ->
        Box(modifier = Modifier.padding(paddingValues)) {
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color(0xFFF6F6F8))
                    .verticalScroll(rememberScrollState())
                    .padding(bottom = 100.dp)
            ) {
            // 1. User Info Header
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(vertical = 32.dp),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Box(contentAlignment = Alignment.BottomEnd) {
                    AsyncImage(
                        model = uiState.user?.avatarUrl ?: "https://lh3.googleusercontent.com/aida-public/AB6AXuD4KnNnslCwiFL552IEmy5IR2hEOID9dMTp0ExkhSppE0NWyyct8nQS2FG-JR3XnA16t_c4Hxs5NMmSy_kQle3o9LgdA2O0OZBbQ1y96w6cWEG2eZf-is4KTmG8s1NTwKj39hepq2ZsDADOzuTUrHDAawF3xkHhQNNyKHX-vrQ6_zMetdQbIEXzz2A0t0cqnmfHRojs-9PoTwVwkSDDSNvwcGr-Udu-kU0nmimsePMUsO-tZFjV99EUqLjsqhaxPJjC57lbImyr7W8",
                        contentDescription = "Avatar",
                        modifier = Modifier
                            .size(96.dp)
                            .clip(CircleShape)
                            .border(4.dp, Color.White, CircleShape)
                            .shadow(4.dp, CircleShape),
                        contentScale = ContentScale.Crop
                    )
                    IconButton(
                        onClick = { /* TODO: Edit Photo */ },
                        modifier = Modifier
                            .size(32.dp)
                            .clip(CircleShape)
                            .background(Color(0xFF3B3FF1))
                            .border(2.dp, Color.White, CircleShape)
                    ) {
                        Icon(Icons.Default.Edit, null, tint = Color.White, modifier = Modifier.size(16.dp))
                    }
                }
                
                Spacer(modifier = Modifier.height(16.dp))
                
                Text(
                    uiState.user?.name ?: "Sarah Jenkins",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.ExtraBold
                )
                Text(
                    uiState.user?.email ?: "sarah.j@example.com",
                    style = MaterialTheme.typography.bodyMedium,
                    color = Color.Gray
                )
            }

            // 2. Premium Card
            Box(
                modifier = Modifier
                    .padding(horizontal = 16.dp)
                    .fillMaxWidth()
                    .clip(RoundedCornerShape(24.dp))
                    .background(
                        androidx.compose.ui.graphics.Brush.horizontalGradient(
                            colors = listOf(Color(0xFF3B3FF1), Color(0xFF2563EB))
                        )
                    )
                    .padding(20.dp)
            ) {
                Row(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column {
                        Text("Current Plan", color = Color.White.copy(alpha = 0.8f), style = MaterialTheme.typography.labelMedium)
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            Text("STYLO Premium", color = Color.White, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Bold)
                            Spacer(modifier = Modifier.width(8.dp))
                            Icon(Icons.Default.Stars, null, tint = Color.Yellow, modifier = Modifier.size(20.dp))
                        }
                        Text("Next billing on Oct 5, 2023", color = Color.White.copy(alpha = 0.8f), style = MaterialTheme.typography.bodySmall)
                    }
                    Button(
                        onClick = { /* TODO: Manage */ },
                        colors = ButtonDefaults.buttonColors(containerColor = Color.White.copy(alpha = 0.2f)),
                        modifier = Modifier.clip(RoundedCornerShape(12.dp))
                    ) {
                        Text("Manage", color = Color.White, fontWeight = FontWeight.Bold)
                    }
                }
            }

            Spacer(modifier = Modifier.height(32.dp))

            // 3. Settings Sections
            SettingsSection("Account Settings") {
                SettingsItem(icon = Icons.Default.Lock, bg = Color(0xFFEFF6FF), tint = Color(0xFF3B3FF1), title = "Change Password")
                Divider(modifier = Modifier.padding(start = 56.dp), color = Color(0xFFF3F4F6))
                SettingsItem(icon = Icons.Default.Mail, bg = Color(0xFFEFF6FF), tint = Color(0xFF3B3FF1), title = "Email Preferences")
            }

            Spacer(modifier = Modifier.height(24.dp))

            SettingsSection("App Preferences") {
                SettingsToggleItem(icon = Icons.Default.Notifications, bg = Color(0xFFF5F3FF), tint = Color(0xFF7C3AED), title = "Notifications", checked = true)
                Divider(modifier = Modifier.padding(start = 56.dp), color = Color(0xFFF3F4F6))
                SettingsToggleItem(icon = Icons.Default.DarkMode, bg = Color(0xFFF5F3FF), tint = Color(0xFF7C3AED), title = "Dark Mode", checked = false)
            }

            Spacer(modifier = Modifier.height(24.dp))

            SettingsSection("Help & Support") {
                SettingsItem(icon = Icons.Default.Help, bg = Color(0xFFFFF7ED), tint = Color(0xFFF97316), title = "FAQ")
                Divider(modifier = Modifier.padding(start = 56.dp), color = Color(0xFFF3F4F6))
                SettingsItem(icon = Icons.Default.Mail, bg = Color(0xFFFFF7ED), tint = Color(0xFFF97316), title = "Contact Us")
                Divider(modifier = Modifier.padding(start = 56.dp), color = Color(0xFFF3F4F6))
                SettingsItem(icon = Icons.Default.PrivacyTip, bg = Color(0xFFFFF7ED), tint = Color(0xFFF97316), title = "Privacy Policy")
            }

            Spacer(modifier = Modifier.height(32.dp))

            // 4. Logout
            Button(
                onClick = onLogout,
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp)
                    .height(56.dp),
                shape = RoundedCornerShape(16.dp),
                colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFFEF2F2), contentColor = Color(0xFFEF4444))
            ) {
                Icon(Icons.Default.Logout, null)
                Spacer(modifier = Modifier.width(8.dp))
                Text("Log Out", fontWeight = FontWeight.Bold)
            }

            Spacer(modifier = Modifier.height(16.dp))
            
            Text(
                "STYLO AI v2.4.0",
                style = MaterialTheme.typography.labelSmall,
                color = Color.Gray,
                modifier = Modifier.align(Alignment.CenterHorizontally)
            )
        }

        if (loading) {
            Box(
                modifier = Modifier
                    .fillMaxSize()
                    .background(Color.Black.copy(alpha = 0.05f)),
                contentAlignment = Alignment.Center
            ) {
                CircularProgressIndicator(color = MaterialTheme.colorScheme.primary)
            }
        }
        }
    }
}

@Composable
fun SettingsSection(title: String, content: @Composable ColumnScope.() -> Unit) {
    Column(modifier = Modifier.padding(horizontal = 16.dp)) {
        Text(
            title.uppercase(), 
            style = MaterialTheme.typography.labelSmall, 
            color = Color.Gray,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.padding(start = 8.dp, bottom = 8.dp)
        )
        Card(
            colors = CardDefaults.cardColors(containerColor = Color.White),
            shape = RoundedCornerShape(20.dp),
            elevation = CardDefaults.cardElevation(defaultElevation = 2.dp),
            modifier = Modifier.fillMaxWidth(),
            content = content
        )
    }
}

@Composable
fun SettingsItem(icon: ImageVector, bg: Color, tint: Color, title: String) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable { }
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .background(bg, RoundedCornerShape(12.dp)),
            contentAlignment = Alignment.Center
        ) {
            Icon(icon, null, tint = tint, modifier = Modifier.size(20.dp))
        }
        Spacer(modifier = Modifier.width(16.dp))
        Text(title, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold, modifier = Modifier.weight(1f))
        Icon(Icons.Default.ChevronRight, null, tint = Color.LightGray)
    }
}

@Composable
fun SettingsToggleItem(icon: ImageVector, bg: Color, tint: Color, title: String, checked: Boolean) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(16.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Box(
            modifier = Modifier
                .size(40.dp)
                .background(bg, RoundedCornerShape(12.dp)),
            contentAlignment = Alignment.Center
        ) {
            Icon(icon, null, tint = tint, modifier = Modifier.size(20.dp))
        }
        Spacer(modifier = Modifier.width(16.dp))
        Text(title, style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold, modifier = Modifier.weight(1f))
        Switch(
            checked = checked, 
            onCheckedChange = {},
            colors = SwitchDefaults.colors(
                checkedThumbColor = Color.White,
                checkedTrackColor = Color(0xFF3B3FF1)
            )
        )
    }
}
