package com.example.oppo_play.ui

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyRow
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.BarChart
import androidx.compose.material.icons.outlined.Book
import androidx.compose.material.icons.outlined.CheckCircle
import androidx.compose.material.icons.outlined.CloudDownload
import androidx.compose.material.icons.outlined.Download
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.outlined.FileDownload
import androidx.compose.material.icons.outlined.Info
import androidx.compose.material.icons.outlined.KeyboardArrowRight
import androidx.compose.material.icons.outlined.LibraryBooks
import androidx.compose.material.icons.outlined.Mic
import androidx.compose.material.icons.outlined.MoreVert
import androidx.compose.material.icons.outlined.PlayArrow
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material.icons.rounded.Android
import androidx.compose.material.icons.rounded.Gamepad
import androidx.compose.material.icons.rounded.Home
import androidx.compose.material.icons.rounded.Star
import androidx.compose.material3.AssistChip
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.FilterChip
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.getValue
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import com.example.oppo_play.data.PlayCatalog
import com.example.oppo_play.model.ContentType
import com.example.oppo_play.model.PlayItem
import kotlin.math.absoluteValue

@Composable
fun AppsHomeScreen(navController: NavController) {
    val forYou = PlayCatalog.apps.take(8)
    val editors = PlayCatalog.editorsChoice
    val newAndUpdated = PlayCatalog.newAndUpdated.take(6)
    val workCollection = PlayCatalog.trendingCollections.first()

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item { Spacer(modifier = Modifier.height(8.dp)) }
        item { PlayHeader(title = "Apps") }
        item { PlaySearchBar(hint = "Search apps & games") }
        item { CategoryRow(labels = listOf("For you", "Top charts", "Kids", "Premium")) }

        item {
            SectionHeader(
                title = "Recommended for you",
                action = "See all"
            ) { navController.navigate("${PlayDestination.TopCharts.route}/${ContentType.APP.name}") }
        }
        item {
            AppCarousel(items = forYou, onItemClick = { navController.navigate("detail/${it.id}") })
        }

        item {
            SectionHeader(
                title = "Work essentials",
                subtitle = workCollection.subtitle,
                action = "Open"
            ) { navController.navigate("collection/${workCollection.id}") }
        }
        item {
            AppCarousel(
                items = workCollection.items.take(6),
                onItemClick = { navController.navigate("detail/${it.id}") }
            )
        }

        item {
            SectionHeader(
                title = "Editors' Choice",
                subtitle = "Handpicked quality apps"
            )
        }
        item {
            AppCarousel(
                items = editors,
                cardStyle = CardStyle.Highlighted,
                onItemClick = { navController.navigate("detail/${it.id}") }
            )
        }

        item {
            SectionHeader(
                title = "New & updated apps",
                subtitle = "Fresh features and early access"
            )
        }
        item {
            AppCarousel(
                items = newAndUpdated,
                onItemClick = { navController.navigate("detail/${it.id}") }
            )
        }

        item {
            SectionHeader(
                title = "Top free apps",
                action = "See top chart"
            ) { navController.navigate("${PlayDestination.TopCharts.route}/${ContentType.APP.name}") }
        }
        items(PlayCatalog.topFreeApps) { app ->
            RankedAppRow(
                rank = PlayCatalog.topFreeApps.indexOf(app) + 1,
                item = app,
                onClick = { navController.navigate("detail/${app.id}") }
            )
        }

        item { Spacer(modifier = Modifier.height(96.dp)) }
    }
}

@Composable
fun GamesHomeScreen(navController: NavController) {
    val heroCollection = PlayCatalog.trendingCollections.find { it.id == "weekend" }
    val topFree = PlayCatalog.topFreeGames
    val storyGames = PlayCatalog.games.filter { it.tags.contains("Story-rich") || it.category == "Adventure" }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item { Spacer(modifier = Modifier.height(8.dp)) }
        item { PlayHeader(title = "Games") }
        item { PlaySearchBar(hint = "Search games") }
        item { CategoryRow(labels = listOf("For you", "Top charts", "Premium", "Events")) }

        item {
            SectionHeader(
                title = heroCollection?.title ?: "Weekend picks",
                subtitle = heroCollection?.subtitle ?: "Narrative adventures and sims",
                action = "Open"
            ) {
                navController.navigate("collection/${heroCollection?.id ?: "weekend"}")
            }
        }
        item {
            AppCarousel(
                items = heroCollection?.items ?: PlayCatalog.games.take(6),
                cardStyle = CardStyle.Highlighted,
                onItemClick = { navController.navigate("detail/${it.id}") }
            )
        }

        item { SectionHeader(title = "Top free games", action = "See top chart") { navController.navigate("${PlayDestination.TopCharts.route}/${ContentType.GAME.name}") } }
        items(topFree) { game ->
            RankedAppRow(
                rank = topFree.indexOf(game) + 1,
                item = game,
                onClick = { navController.navigate("detail/${game.id}") }
            )
        }

        item { SectionHeader(title = "Story & adventure", subtitle = "Finishable in a weekend") }
        item { AppCarousel(items = storyGames.take(8), onItemClick = { navController.navigate("detail/${it.id}") }) }

        item { SectionHeader(title = "Multiplayer & live events") }
        item {
            AppCarousel(
                items = PlayCatalog.games.filter { it.tags.contains("Multiplayer") || it.tags.contains("Events") },
                onItemClick = { navController.navigate("detail/${it.id}") }
            )
        }

        item { Spacer(modifier = Modifier.height(96.dp)) }
    }
}

@Composable
fun MediaHomeScreen(navController: NavController) {
    val media = PlayCatalog.media
    val books = PlayCatalog.books

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item { Spacer(modifier = Modifier.height(8.dp)) }
        item { PlayHeader(title = "Movies & Books") }
        item { PlaySearchBar(hint = "Search movies, books, audiobooks") }
        item { CategoryRow(labels = listOf("For you", "Top selling", "New releases")) }

        item { SectionHeader(title = "New to rent or buy", action = "See all") { navController.navigate("${PlayDestination.TopCharts.route}/${ContentType.MOVIE.name}") } }
        items(media) { item ->
            MediaCard(item = item, onClick = { navController.navigate("detail/${item.id}") })
        }

        item { SectionHeader(title = "Audiobooks & ebooks", action = "Browse books") { navController.navigate("${PlayDestination.TopCharts.route}/${ContentType.BOOK.name}") } }
        item { AppCarousel(items = books, onItemClick = { navController.navigate("detail/${it.id}") }) }

        item { SectionHeader(title = "Staff picks for the week") }
        item {
            AppCarousel(
                items = (media + books).shuffled().take(8),
                cardStyle = CardStyle.Highlighted,
                onItemClick = { navController.navigate("detail/${it.id}") }
            )
        }

        item { Spacer(modifier = Modifier.height(96.dp)) }
    }
}

@Composable
fun LibraryScreen(navController: NavController) {
    val installed = PlayCatalog.apps.take(4)
    val updates = PlayCatalog.newAndUpdated.take(3)
    val wishlist = PlayCatalog.games.takeLast(3)

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item { Spacer(modifier = Modifier.height(8.dp)) }
        item { PlayHeader(title = "Library") }
        item { PlaySearchBar(hint = "Search your apps") }

        item { SectionHeader(title = "Updates available", action = "Update all") { } }
        items(updates) { app ->
            LibraryRow(
                label = app.name,
                subLabel = "Updated ${app.sizeMb} MB • ${app.category}",
                icon = Icons.Outlined.Download,
                onClick = { navController.navigate("detail/${app.id}") }
            )
        }

        item { SectionHeader(title = "Installed") }
        items(installed) { app ->
            LibraryRow(
                label = app.name,
                subLabel = "${app.category} • ${app.rating} ★",
                icon = Icons.Outlined.CheckCircle,
                onClick = { navController.navigate("detail/${app.id}") }
            )
        }

        item { SectionHeader(title = "Wishlist") }
        items(wishlist) { app ->
            LibraryRow(
                label = app.name,
                subLabel = "${app.category} • ${app.price}",
                icon = Icons.Outlined.FavoriteBorder,
                onClick = { navController.navigate("detail/${app.id}") }
            )
        }

        item { Spacer(modifier = Modifier.height(96.dp)) }
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
fun TopChartsScreen(navController: NavController, type: ContentType) {
    var selectedChart by remember { mutableStateOf("Top free") }
    val items = when (type) {
        ContentType.GAME -> PlayCatalog.games
        ContentType.MOVIE -> PlayCatalog.media
        ContentType.BOOK -> PlayCatalog.books
        else -> PlayCatalog.apps
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        item { Spacer(modifier = Modifier.height(8.dp)) }
        item {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween,
                modifier = Modifier.fillMaxWidth()
            ) {
                Text(
                    text = "${type.name.lowercase().replaceFirstChar { it.uppercase() }} top charts",
                    style = MaterialTheme.typography.headlineSmall,
                    fontWeight = FontWeight.Bold
                )
                Icon(
                    imageVector = Icons.Outlined.MoreVert,
                    contentDescription = null
                )
            }
        }
        stickyHeader {
            Surface(
                color = MaterialTheme.colorScheme.background
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 8.dp),
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    listOf("Top free", "Trending", "Top grossing", "Top paid").forEach { chart ->
                        FilterChip(
                            selected = selectedChart == chart,
                            onClick = { selectedChart = chart },
                            leadingIcon = if (chart == "Top free") {
                                { Icon(Icons.Outlined.CloudDownload, contentDescription = null) }
                            } else null,
                            label = { Text(chart) }
                        )
                    }
                }
            }
        }

        items(items.withIndex().toList()) { indexed ->
            RankedAppRow(
                rank = indexed.index + 1,
                item = indexed.value,
                onClick = { navController.navigate("detail/${indexed.value.id}") }
            )
        }

        item { Spacer(modifier = Modifier.height(96.dp)) }
    }
}

@Composable
fun CollectionScreen(navController: NavController, collectionId: String) {
    val collection = PlayCatalog.trendingCollections.find { it.id == collectionId } ?: PlayCatalog.trendingCollections.first()
    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        item { Spacer(modifier = Modifier.height(8.dp)) }
        item {
            Text(
                text = collection.title,
                style = MaterialTheme.typography.headlineSmall,
                fontWeight = FontWeight.Bold
            )
            Text(
                text = collection.subtitle,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
        items(collection.items) { app ->
            WideAppRow(item = app, onClick = { navController.navigate("detail/${app.id}") })
        }
        item { Spacer(modifier = Modifier.height(96.dp)) }
    }
}

@Composable
fun DetailScreen(navController: NavController, itemId: String) {
    val item = PlayCatalog.allItems.find { it.id == itemId }

    if (item == null) {
        Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
            Text("Content not found")
        }
        return
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .padding(horizontal = 16.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        item { Spacer(modifier = Modifier.height(8.dp)) }
        item { DetailHeader(item = item) }
        item { ActionButtons() }
        item { StatRow(item = item) }
        item {
            AssistChipRow(tags = item.tags + item.badges)
        }
        item { Text(text = "About this ${item.contentType.name.lowercase()}", style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold) }
        item {
            Text(
                text = item.description,
                style = MaterialTheme.typography.bodyMedium,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                lineHeight = 20.sp
            )
        }
        item { ScreenshotRow(labels = item.screenshots) }
        item {
            SectionHeader(
                title = "Similar",
                action = "See more"
            ) { navController.navigate("${PlayDestination.TopCharts.route}/${item.contentType.name}") }
        }
        item { AppCarousel(items = relatedItems(item).take(6), onItemClick = { navController.navigate("detail/${it.id}") }) }
        item { Spacer(modifier = Modifier.height(96.dp)) }
    }
}

private fun relatedItems(current: PlayItem): List<PlayItem> {
    val sameCategory = PlayCatalog.allItems.filter { it.category == current.category && it.id != current.id }
    return if (sameCategory.isNotEmpty()) sameCategory else PlayCatalog.allItems.filter { it.contentType == current.contentType && it.id != current.id }
}

// UI components

@Composable
fun PlayHeader(title: String) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween
    ) {
        Row(
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(8.dp)
        ) {
            Surface(
                modifier = Modifier.size(44.dp),
                shape = RoundedCornerShape(14.dp),
                color = MaterialTheme.colorScheme.primary
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(
                        imageVector = when (title) {
                            "Apps" -> Icons.Rounded.Android
                            "Games" -> Icons.Rounded.Gamepad
                            "Movies & Books" -> Icons.Outlined.Book
                            "Library" -> Icons.Outlined.LibraryBooks
                            else -> Icons.Rounded.Home
                        },
                        contentDescription = null,
                        tint = MaterialTheme.colorScheme.onPrimary
                    )
                }
            }
            Column {
                Text(text = title, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
                Text(
                    text = "For you • Trending • Premium • Kids",
                    style = MaterialTheme.typography.bodySmall,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
        Icon(imageVector = Icons.Outlined.MoreVert, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Composable
fun PlaySearchBar(hint: String) {
    var query by remember { mutableStateOf("") }
    TextField(
        value = query,
        onValueChange = { query = it },
        placeholder = { Text(hint) },
        leadingIcon = { Icon(Icons.Outlined.Search, contentDescription = null) },
        trailingIcon = { Icon(Icons.Outlined.Mic, contentDescription = "Voice") },
        singleLine = true,
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 6.dp),
        colors = TextFieldDefaults.colors(
            focusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
            unfocusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
            focusedIndicatorColor = Color.Transparent,
            unfocusedIndicatorColor = Color.Transparent
        ),
        shape = RoundedCornerShape(50)
    )
}

@Composable
fun CategoryRow(labels: List<String>) {
    val scrollState = rememberScrollState()
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .horizontalScroll(scrollState),
        horizontalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        labels.forEach { label ->
            AssistChip(
                onClick = {},
                label = { Text(label) },
                leadingIcon = {
                    if (label.contains("Top", ignoreCase = true)) {
                        Icon(Icons.Outlined.BarChart, contentDescription = null)
                    }
                }
            )
        }
    }
}

enum class CardStyle { Default, Highlighted }

@Composable
fun AppCarousel(items: List<PlayItem>, cardStyle: CardStyle = CardStyle.Default, onItemClick: (PlayItem) -> Unit) {
    LazyRow(
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items(items) { item ->
            AppCard(item = item, cardStyle = cardStyle, onClick = { onItemClick(item) })
        }
    }
}

@Composable
fun AppCard(item: PlayItem, cardStyle: CardStyle = CardStyle.Default, onClick: () -> Unit) {
    val cardColors = CardDefaults.cardColors(
        containerColor = if (cardStyle == CardStyle.Highlighted) MaterialTheme.colorScheme.surfaceVariant else MaterialTheme.colorScheme.surface
    )
    Card(
        modifier = Modifier
            .width(160.dp)
            .clickable(onClick = onClick),
        colors = cardColors,
        elevation = CardDefaults.cardElevation(defaultElevation = if (cardStyle == CardStyle.Highlighted) 6.dp else 0.dp)
    ) {
        Column(modifier = Modifier.padding(12.dp), verticalArrangement = Arrangement.spacedBy(8.dp)) {
            ArtSquare(seed = item.id, badge = item.badges.firstOrNull())
            Text(text = item.name, style = MaterialTheme.typography.bodyLarge, maxLines = 1, overflow = TextOverflow.Ellipsis)
            Text(
                text = item.shortDescription,
                style = MaterialTheme.typography.bodySmall,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis
            )
            RatingDownloadsRow(item = item)
        }
    }
}

@Composable
fun MediaCard(item: PlayItem, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Row(
            modifier = Modifier
                .padding(12.dp)
                .fillMaxWidth(),
            horizontalArrangement = Arrangement.SpaceBetween,
            verticalAlignment = Alignment.CenterVertically
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.spacedBy(12.dp)
            ) {
                ArtSquare(seed = item.id, size = 72.dp, badge = item.price)
                Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
                    Text(item.name, style = MaterialTheme.typography.titleMedium, maxLines = 1, overflow = TextOverflow.Ellipsis)
                    Text(item.shortDescription, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant, maxLines = 2)
                    Text("${item.price} • ${item.rating} ★", style = MaterialTheme.typography.bodySmall, fontWeight = FontWeight.Medium)
                }
            }
            Icon(imageVector = Icons.Outlined.PlayArrow, contentDescription = null, tint = MaterialTheme.colorScheme.primary)
        }
    }
}

@Composable
fun RankedAppRow(rank: Int, item: PlayItem, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(vertical = 6.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        Text(
            text = "$rank",
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Bold,
            modifier = Modifier.width(28.dp)
        )
        ArtSquare(seed = item.id, size = 60.dp, badge = if (item.isNew) "New" else null)
        Column(modifier = Modifier.widthIn(max = 220.dp)) {
            Text(item.name, style = MaterialTheme.typography.titleSmall, maxLines = 1, overflow = TextOverflow.Ellipsis)
            Text(item.category, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            RatingDownloadsRow(item = item)
        }
        Icon(imageVector = Icons.Outlined.KeyboardArrowRight, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Composable
fun WideAppRow(item: PlayItem, onClick: () -> Unit) {
    Card(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            ArtSquare(seed = item.id, size = 70.dp, badge = item.badges.firstOrNull())
            Column(modifier = Modifier.widthIn(max = 220.dp), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                Text(item.name, style = MaterialTheme.typography.titleMedium)
                Text(item.shortDescription, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant, maxLines = 2)
                RatingDownloadsRow(item = item)
            }
            OutlinedButton(onClick = onClick) { Text(if (item.price == "Free") "Install" else "View") }
        }
    }
}

@Composable
fun ArtSquare(seed: String, size: Dp = 84.dp, badge: String? = null) {
    val colors = gradientFor(seed)
    Box(
        modifier = Modifier
            .size(size)
            .clip(RoundedCornerShape(18.dp))
            .background(brush = Brush.linearGradient(colors))
            .border(1.dp, MaterialTheme.colorScheme.outlineVariant, RoundedCornerShape(18.dp)),
        contentAlignment = Alignment.TopEnd
    ) {
        if (!badge.isNullOrBlank()) {
            Surface(
                color = MaterialTheme.colorScheme.surface,
                shape = RoundedCornerShape(bottomStart = 10.dp, topEnd = 18.dp),
                tonalElevation = 2.dp,
                shadowElevation = 2.dp
            ) {
                Text(
                    text = badge,
                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                    style = MaterialTheme.typography.labelSmall,
                    color = MaterialTheme.colorScheme.primary
                )
            }
        }
        Canvas(modifier = Modifier
            .matchParentSize()
            .padding(16.dp)) {
            drawArc(
                color = Color.White.copy(alpha = 0.18f),
                startAngle = -90f,
                sweepAngle = 240f,
                useCenter = false,
                style = Stroke(width = 12f, cap = StrokeCap.Round)
            )
        }
    }
}

private fun gradientFor(seed: String): List<Color> {
    val hash = seed.hashCode().absoluteValue % 360
    val hue = hash.toFloat()
    val hue2 = (hash + 32) % 360
    return listOf(
        Color.hsl(hue, 0.60f, 0.55f),
        Color.hsl(hue2.toFloat(), 0.62f, 0.45f)
    )
}

@Composable
fun RatingDownloadsRow(item: PlayItem) {
    Row(
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        Icon(imageVector = Icons.Rounded.Star, contentDescription = null, tint = MaterialTheme.colorScheme.secondary, modifier = Modifier.size(16.dp))
        Text("${item.rating}", style = MaterialTheme.typography.labelMedium, fontWeight = FontWeight.SemiBold)
        Text("•", style = MaterialTheme.typography.labelMedium)
        Text(item.downloads, style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Composable
fun SectionHeader(title: String, subtitle: String? = null, action: String? = null, onAction: (() -> Unit)? = null) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Column {
            Text(title, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            if (!subtitle.isNullOrBlank()) {
                Text(subtitle, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
        if (!action.isNullOrBlank() && onAction != null) {
            Text(
                text = action,
                style = MaterialTheme.typography.labelLarge,
                color = MaterialTheme.colorScheme.primary,
                modifier = Modifier.clickable(onClick = onAction)
            )
        }
    }
}

@Composable
fun LibraryRow(label: String, subLabel: String, icon: androidx.compose.ui.graphics.vector.ImageVector, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(vertical = 8.dp),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Surface(
                modifier = Modifier.size(44.dp),
                shape = CircleShape,
                color = MaterialTheme.colorScheme.surfaceVariant
            ) {
                Box(contentAlignment = Alignment.Center) {
                    Icon(icon, contentDescription = null)
                }
            }
        Column(modifier = Modifier.widthIn(max = 240.dp)) {
            Text(label, style = MaterialTheme.typography.bodyLarge)
            Text(subLabel, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
        Icon(Icons.Outlined.KeyboardArrowRight, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Composable
fun DetailHeader(item: PlayItem) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(14.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        ArtSquare(seed = item.id, size = 88.dp, badge = item.badges.firstOrNull())
        Column(modifier = Modifier.widthIn(max = 240.dp)) {
            Text(item.name, style = MaterialTheme.typography.headlineSmall, fontWeight = FontWeight.Bold)
            Text(item.developer, style = MaterialTheme.typography.bodySmall, color = MaterialTheme.colorScheme.onSurfaceVariant)
            Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                Icon(imageVector = Icons.Rounded.Star, contentDescription = null, tint = MaterialTheme.colorScheme.secondary, modifier = Modifier.size(16.dp))
                Text("${item.rating}", style = MaterialTheme.typography.bodyMedium, fontWeight = FontWeight.SemiBold)
                Text("• ${item.downloads}", style = MaterialTheme.typography.bodyMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
        Icon(imageVector = Icons.Outlined.MoreVert, contentDescription = null, tint = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Composable
fun ActionButtons() {
    Column(
        modifier = Modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        Button(
            onClick = {},
            modifier = Modifier
                .fillMaxWidth()
                .heightIn(min = 46.dp)
        ) {
            Text("Install")
        }
        OutlinedButton(
            onClick = {},
            modifier = Modifier
                .fillMaxWidth()
                .heightIn(min = 46.dp)
        ) {
            Icon(Icons.Outlined.Info, contentDescription = null, modifier = Modifier.size(18.dp))
            Spacer(modifier = Modifier.width(6.dp))
            Text("About")
        }
    }
}

@Composable
fun StatRow(item: PlayItem) {
    LazyRow(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
        item {
            StatCard(
                label = "Downloads",
                value = item.downloads,
                icon = Icons.Outlined.FileDownload,
                modifier = Modifier.width(150.dp)
            )
        }
        item {
            StatCard(
                label = "Size",
                value = "${item.sizeMb} MB",
                icon = Icons.Outlined.CloudDownload,
                modifier = Modifier.width(150.dp)
            )
        }
        item {
            StatCard(
                label = "Rating",
                value = "${item.rating}",
                icon = Icons.Rounded.Star,
                modifier = Modifier.width(150.dp)
            )
        }
    }
}

@Composable
fun StatCard(
    label: String,
    value: String,
    icon: androidx.compose.ui.graphics.vector.ImageVector,
    modifier: Modifier = Modifier
) {
    Card(
        modifier = modifier
            .padding(horizontal = 4.dp),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
    ) {
        Column(
            modifier = Modifier
                .padding(12.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp),
            horizontalAlignment = Alignment.Start
        ) {
            Icon(icon, contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(20.dp))
            Text(value, style = MaterialTheme.typography.titleMedium, fontWeight = FontWeight.Bold)
            Text(label, style = MaterialTheme.typography.labelMedium, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
fun AssistChipRow(tags: List<String>) {
    val scrollState = rememberScrollState()
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .horizontalScroll(scrollState),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        tags.distinct().forEach { tag ->
            AssistChip(onClick = {}, label = { Text(tag) })
        }
    }
}

@Composable
fun ScreenshotRow(labels: List<String>) {
    LazyRow(horizontalArrangement = Arrangement.spacedBy(12.dp)) {
        items(labels) { label ->
            Card(
                modifier = Modifier
                    .width(240.dp)
                    .aspectRatio(9f / 16f),
                colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surfaceVariant)
            ) {
                Box(
                    modifier = Modifier
                        .fillMaxSize()
                        .padding(12.dp)
                        .background(
                            brush = Brush.linearGradient(gradientFor(label)),
                            shape = RoundedCornerShape(12.dp)
                        ),
                    contentAlignment = Alignment.BottomStart
                ) {
                    Text(
                        text = label,
                        style = MaterialTheme.typography.bodyMedium,
                        color = MaterialTheme.colorScheme.onPrimary,
                        modifier = Modifier
                            .background(Color.Black.copy(alpha = 0.25f), RoundedCornerShape(8.dp))
                            .padding(horizontal = 8.dp, vertical = 6.dp)
                    )
                }
            }
        }
    }
}
