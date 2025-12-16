package com.example.oppo_play.ui

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.net.Uri
import android.util.Base64
import androidx.activity.compose.rememberLauncherForActivityResult
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.automirrored.outlined.ArrowBack
import androidx.compose.material.icons.automirrored.outlined.ExitToApp
import androidx.compose.material.icons.outlined.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.platform.LocalSoftwareKeyboardController
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import coil.compose.AsyncImage
import com.example.oppo_play.data.DownloadHistoryItem
import com.example.oppo_play.data.UserHistoryRepository
import com.example.oppo_play.data.UserReviewItem
import com.example.oppo_play.data.WishlistItem
import com.example.oppo_play.model.User
import com.example.oppo_play.ui.components.StarRating
import kotlinx.coroutines.launch
import java.io.ByteArrayOutputStream
import java.text.SimpleDateFormat
import java.util.*

enum class ProfileTab(val label: String, val icon: ImageVector) {
    PROFILE("Profile", Icons.Outlined.Person),
    HISTORY("History", Icons.Outlined.History),
    WISHLIST("Wishlist", Icons.Outlined.FavoriteBorder),
    SETTINGS("Settings", Icons.Outlined.Settings)
}

@Composable
fun ProfileScreen(
    navController: NavController,
    userViewModel: UserViewModel
) {
    val user = userViewModel.user
    var selectedTab by remember { mutableStateOf(ProfileTab.PROFILE) }
    var showEditDialog by remember { mutableStateOf(false) }
    val context = LocalContext.current
    val scope = rememberCoroutineScope()

    val imagePickerLauncher = rememberLauncherForActivityResult(
        contract = ActivityResultContracts.GetContent()
    ) { uri: Uri? ->
        uri?.let {
            scope.launch {
                val dataUrl = uriToBase64DataUrl(context, it)
                if (dataUrl != null) {
                    userViewModel.updateAvatar(dataUrl)
                }
            }
        }
    }

    if (showEditDialog && user != null) {
        EditProfileDialog(
            user = user,
            onDismiss = { showEditDialog = false },
            onSave = { name, email ->
                userViewModel.updateProfile(name, email)
                showEditDialog = false
            }
        )
    }

    Column(modifier = Modifier.fillMaxSize()) {
        // Top bar
        Surface(
            modifier = Modifier.fillMaxWidth(),
            shadowElevation = 2.dp
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 8.dp, vertical = 12.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                IconButton(onClick = { navController.popBackStack() }) {
                    Icon(Icons.AutoMirrored.Outlined.ArrowBack, "Back")
                }
                Text(
                    "Profile",
                    style = MaterialTheme.typography.titleLarge,
                    fontWeight = FontWeight.SemiBold
                )
            }
        }

        if (user != null) {
            // Profile header
            ProfileHeader(
                user = user,
                onEditClick = { showEditDialog = true },
                onAvatarClick = { imagePickerLauncher.launch("image/*") }
            )

            // Tab bar
            TabRow(
                selectedTab = selectedTab,
                onTabSelected = { selectedTab = it }
            )

            // Tab content
            when (selectedTab) {
                ProfileTab.PROFILE -> ProfileTabContent(userId = user.id, navController = navController)
                ProfileTab.HISTORY -> HistoryTabContent(userId = user.id, navController = navController)
                ProfileTab.WISHLIST -> WishlistTabContent(userId = user.id, navController = navController)
                ProfileTab.SETTINGS -> SettingsTabContent(
                    onLogout = {
                        userViewModel.logout()
                        navController.popBackStack()
                    }
                )
            }
        }
    }
}

private fun uriToBase64DataUrl(context: android.content.Context, uri: Uri): String? {
    return try {
        val inputStream = context.contentResolver.openInputStream(uri) ?: return null
        val bitmap = BitmapFactory.decodeStream(inputStream)
        inputStream.close()

        // Resize if too large (max 512px)
        val maxSize = 512
        val scaledBitmap = if (bitmap.width > maxSize || bitmap.height > maxSize) {
            val scale = maxSize.toFloat() / maxOf(bitmap.width, bitmap.height)
            Bitmap.createScaledBitmap(
                bitmap,
                (bitmap.width * scale).toInt(),
                (bitmap.height * scale).toInt(),
                true
            )
        } else {
            bitmap
        }

        val outputStream = ByteArrayOutputStream()
        scaledBitmap.compress(Bitmap.CompressFormat.JPEG, 80, outputStream)
        val base64 = Base64.encodeToString(outputStream.toByteArray(), Base64.NO_WRAP)
        "data:image/jpeg;base64,$base64"
    } catch (e: Exception) {
        null
    }
}

@Composable
private fun ProfileHeader(
    user: User,
    onEditClick: () -> Unit,
    onAvatarClick: () -> Unit
) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(24.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Box(contentAlignment = Alignment.BottomEnd) {
            Box(
                modifier = Modifier
                    .size(80.dp)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.primary)
                    .clickable(onClick = onAvatarClick),
                contentAlignment = Alignment.Center
            ) {
                if (user.avatar != null) {
                    AsyncImage(
                        model = user.avatar,
                        contentDescription = null,
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop
                    )
                } else {
                    Text(
                        text = user.name.firstOrNull()?.uppercase() ?: "?",
                        style = MaterialTheme.typography.headlineMedium,
                        color = Color.White,
                        fontWeight = FontWeight.Bold
                    )
                }
            }
            Surface(
                modifier = Modifier
                    .size(28.dp)
                    .clickable(onClick = onAvatarClick),
                shape = CircleShape,
                color = MaterialTheme.colorScheme.surface,
                shadowElevation = 2.dp
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        Icons.Outlined.CameraAlt,
                        contentDescription = "Change avatar",
                        modifier = Modifier.size(16.dp),
                        tint = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }

        Spacer(Modifier.height(12.dp))

        Text(
            user.name,
            style = MaterialTheme.typography.titleLarge,
            fontWeight = FontWeight.Bold
        )

        Text(
            user.email,
            style = MaterialTheme.typography.bodyMedium,
            color = MaterialTheme.colorScheme.onSurfaceVariant
        )

        if (user.createdAt > 0) {
            Text(
                "Member since ${formatDate(user.createdAt)}",
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant.copy(alpha = 0.7f)
            )
        }

        Spacer(Modifier.height(12.dp))

        OutlinedButton(onClick = onEditClick) {
            Icon(Icons.Outlined.Edit, null, modifier = Modifier.size(18.dp))
            Spacer(Modifier.width(8.dp))
            Text("Edit Profile")
        }
    }
}

@Composable
private fun TabRow(
    selectedTab: ProfileTab,
    onTabSelected: (ProfileTab) -> Unit
) {
    ScrollableTabRow(
        selectedTabIndex = selectedTab.ordinal,
        edgePadding = 16.dp,
        divider = { HorizontalDivider() }
    ) {
        ProfileTab.entries.forEach { tab ->
            Tab(
                selected = selectedTab == tab,
                onClick = { onTabSelected(tab) },
                text = {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(6.dp)
                    ) {
                        Icon(tab.icon, null, modifier = Modifier.size(18.dp))
                        Text(tab.label)
                    }
                }
            )
        }
    }
}

@Composable
private fun ProfileTabContent(userId: String, navController: NavController) {
    var reviews by remember { mutableStateOf<List<UserReviewItem>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(userId) {
        reviews = UserHistoryRepository.fetchUserReviews(userId)
        isLoading = false
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Text(
                "Your reviews",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold
            )
            Spacer(Modifier.height(8.dp))
        }

        if (isLoading) {
            items(3) { LoadingItem() }
        } else if (reviews.isEmpty()) {
            item { EmptyStateCard(
                icon = Icons.Outlined.Star,
                title = "No reviews yet",
                subtitle = "Your feedback helps other users"
            ) }
        } else {
            items(reviews, key = { it.id }) { review ->
                ReviewCard(
                    review = review,
                    onClick = { navController.navigate("detail/${review.app.id}") }
                )
            }
        }
    }
}

@Composable
private fun HistoryTabContent(userId: String, navController: NavController) {
    var downloads by remember { mutableStateOf<List<DownloadHistoryItem>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }

    LaunchedEffect(userId) {
        downloads = UserHistoryRepository.fetchDownloadHistory(userId)
        isLoading = false
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Text(
                "Download history",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold
            )
            Spacer(Modifier.height(8.dp))
        }

        if (isLoading) {
            items(3) { LoadingItem() }
        } else if (downloads.isEmpty()) {
            item { EmptyStateCard(
                icon = Icons.Outlined.History,
                title = "No download history",
                subtitle = "Apps you download will appear here"
            ) }
        } else {
            items(downloads, key = { it.id }) { download ->
                DownloadCard(
                    download = download,
                    onClick = { navController.navigate("detail/${download.app.id}") }
                )
            }
        }
    }
}

@Composable
private fun WishlistTabContent(userId: String, navController: NavController) {
    var wishlist by remember { mutableStateOf<List<WishlistItem>>(emptyList()) }
    var isLoading by remember { mutableStateOf(true) }
    val scope = rememberCoroutineScope()

    LaunchedEffect(userId) {
        wishlist = UserHistoryRepository.fetchWishlist(userId)
        isLoading = false
    }

    fun removeItem(appId: String) {
        scope.launch {
            if (UserHistoryRepository.removeFromWishlist(userId, appId)) {
                wishlist = wishlist.filter { it.app.id != appId }
            }
        }
    }

    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            Text(
                "Wishlist",
                style = MaterialTheme.typography.titleMedium,
                fontWeight = FontWeight.SemiBold
            )
            Spacer(Modifier.height(8.dp))
        }

        if (isLoading) {
            items(3) { LoadingItem() }
        } else if (wishlist.isEmpty()) {
            item { EmptyStateCard(
                icon = Icons.Outlined.FavoriteBorder,
                title = "Your wishlist is empty",
                subtitle = "Save apps you want to download later"
            ) }
        } else {
            items(wishlist, key = { it.id }) { item ->
                WishlistCard(
                    item = item,
                    onClick = { navController.navigate("detail/${item.app.id}") },
                    onRemove = { removeItem(item.app.id) }
                )
            }
        }
    }
}

@Composable
private fun SettingsTabContent(onLogout: () -> Unit) {
    LazyColumn(
        modifier = Modifier.fillMaxSize(),
        contentPadding = PaddingValues(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item {
            SettingsItem(
                icon = Icons.Outlined.Notifications,
                title = "Notifications",
                subtitle = "Manage notification preferences"
            )
        }
        item {
            SettingsItem(
                icon = Icons.Outlined.Security,
                title = "Privacy",
                subtitle = "Privacy and security settings"
            )
        }
        item {
            SettingsItem(
                icon = Icons.Outlined.Storage,
                title = "Storage",
                subtitle = "Manage downloaded apps"
            )
        }
        item {
            SettingsItem(
                icon = Icons.Outlined.Info,
                title = "About",
                subtitle = "App version and info"
            )
        }
        item {
            Spacer(Modifier.height(8.dp))
            Button(
                onClick = onLogout,
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = MaterialTheme.colorScheme.errorContainer,
                    contentColor = MaterialTheme.colorScheme.onErrorContainer
                )
            ) {
                Icon(Icons.AutoMirrored.Outlined.ExitToApp, null)
                Spacer(Modifier.width(8.dp))
                Text("Sign Out")
            }
        }
    }
}

@Composable
private fun ReviewCard(review: UserReviewItem, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.Top
        ) {
            AsyncImage(
                model = review.app.iconUrl,
                contentDescription = null,
                modifier = Modifier
                    .size(48.dp)
                    .clip(RoundedCornerShape(10.dp))
            )
            Spacer(Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    review.app.title,
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Medium
                )
                Row(
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    StarRating(rating = review.rating.toDouble(), size = 14.dp, showNumber = false)
                    Text(
                        formatDateShort(review.createdAt),
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                if (review.content.isNotBlank()) {
                    Text(
                        review.content,
                        style = MaterialTheme.typography.bodySmall,
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis
                    )
                }
            }
        }
    }
}

@Composable
private fun DownloadCard(download: DownloadHistoryItem, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            AsyncImage(
                model = download.app.iconUrl,
                contentDescription = null,
                modifier = Modifier
                    .size(48.dp)
                    .clip(RoundedCornerShape(10.dp))
            )
            Spacer(Modifier.width(12.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(
                    download.app.title,
                    style = MaterialTheme.typography.bodyLarge,
                    fontWeight = FontWeight.Medium
                )
                Text(
                    "Downloaded ${formatDateShort(download.createdAt)}",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
private fun WishlistCard(
    item: WishlistItem,
    onClick: () -> Unit,
    onRemove: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                modifier = Modifier
                    .weight(1f)
                    .clickable(onClick = onClick),
                verticalAlignment = Alignment.CenterVertically
            ) {
                AsyncImage(
                    model = item.app.iconUrl,
                    contentDescription = null,
                    modifier = Modifier
                        .size(48.dp)
                        .clip(RoundedCornerShape(10.dp))
                )
                Spacer(Modifier.width(12.dp))
                Column {
                    Text(
                        item.app.title,
                        style = MaterialTheme.typography.bodyLarge,
                        fontWeight = FontWeight.Medium
                    )
                    item.app.developer?.let { dev ->
                        Text(
                            dev,
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                    item.app.rating?.let { rating ->
                        Row(verticalAlignment = Alignment.CenterVertically) {
                            StarRating(rating = rating, size = 12.dp, showNumber = false)
                            Spacer(Modifier.width(4.dp))
                            Text(
                                String.format("%.1f", rating),
                                style = MaterialTheme.typography.bodySmall,
                                color = MaterialTheme.colorScheme.onSurfaceVariant
                            )
                        }
                    }
                }
            }
            FilledTonalButton(onClick = onRemove) {
                Text("Remove")
            }
        }
    }
}

@Composable
private fun SettingsItem(
    icon: ImageVector,
    title: String,
    subtitle: String,
    onClick: () -> Unit = {}
) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                icon,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant,
                modifier = Modifier.size(24.dp)
            )
            Spacer(Modifier.width(16.dp))
            Column(modifier = Modifier.weight(1f)) {
                Text(title, style = MaterialTheme.typography.bodyLarge)
                Text(
                    subtitle,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
            Icon(
                Icons.Outlined.ChevronRight,
                contentDescription = null,
                tint = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
private fun LoadingItem() {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(modifier = Modifier.padding(12.dp)) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(RoundedCornerShape(10.dp))
                    .background(MaterialTheme.colorScheme.surfaceVariant)
            )
            Spacer(Modifier.width(12.dp))
            Column {
                Box(
                    modifier = Modifier
                        .height(16.dp)
                        .width(120.dp)
                        .clip(RoundedCornerShape(4.dp))
                        .background(MaterialTheme.colorScheme.surfaceVariant)
                )
                Spacer(Modifier.height(8.dp))
                Box(
                    modifier = Modifier
                        .height(12.dp)
                        .width(80.dp)
                        .clip(RoundedCornerShape(4.dp))
                        .background(MaterialTheme.colorScheme.surfaceVariant)
                )
            }
        }
    }
}

@Composable
private fun EmptyStateCard(icon: ImageVector, title: String, subtitle: String) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(12.dp)
    ) {
        Row(
            modifier = Modifier.padding(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Box(
                modifier = Modifier
                    .size(48.dp)
                    .clip(CircleShape)
                    .background(MaterialTheme.colorScheme.primaryContainer),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    icon,
                    contentDescription = null,
                    tint = MaterialTheme.colorScheme.primary,
                    modifier = Modifier.size(24.dp)
                )
            }
            Spacer(Modifier.width(16.dp))
            Column {
                Text(title, fontWeight = FontWeight.Medium)
                Text(
                    subtitle,
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
private fun EditProfileDialog(
    user: User,
    onDismiss: () -> Unit,
    onSave: (name: String, email: String) -> Unit
) {
    var name by remember { mutableStateOf(user.name) }
    var email by remember { mutableStateOf(user.email) }
    val keyboardController = LocalSoftwareKeyboardController.current

    AlertDialog(
        onDismissRequest = onDismiss,
        title = { Text("Edit Profile") },
        text = {
            Column {
                OutlinedTextField(
                    value = name,
                    onValueChange = { name = it },
                    label = { Text("Name") },
                    singleLine = true,
                    modifier = Modifier
                        .fillMaxWidth()
                        .onFocusChanged { if (it.isFocused) keyboardController?.show() }
                )
                Spacer(Modifier.height(8.dp))
                OutlinedTextField(
                    value = email,
                    onValueChange = { email = it },
                    label = { Text("Email") },
                    singleLine = true,
                    modifier = Modifier
                        .fillMaxWidth()
                        .onFocusChanged { if (it.isFocused) keyboardController?.show() }
                )
            }
        },
        confirmButton = {
            Button(
                onClick = { onSave(name.trim(), email.trim()) },
                enabled = name.isNotBlank() && email.contains("@")
            ) {
                Text("Save")
            }
        },
        dismissButton = {
            TextButton(onClick = onDismiss) {
                Text("Cancel")
            }
        }
    )
}

private fun formatDate(millis: Long): String {
    val sdf = SimpleDateFormat("MMMM yyyy", Locale.getDefault())
    return sdf.format(Date(millis))
}

private fun formatDateShort(dateString: String): String {
    return try {
        val inputFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss", Locale.getDefault())
        val outputFormat = SimpleDateFormat("MMM d, yyyy", Locale.getDefault())
        val date = inputFormat.parse(dateString)
        date?.let { outputFormat.format(it) } ?: dateString
    } catch (e: Exception) {
        dateString
    }
}
