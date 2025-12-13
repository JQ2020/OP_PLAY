package com.example.oppo_play.ui

import androidx.compose.foundation.ExperimentalFoundationApi
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.verticalScroll
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.pager.HorizontalPager
import androidx.compose.foundation.pager.rememberPagerState
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.Favorite
import androidx.compose.material.icons.outlined.ArrowBack
import androidx.compose.material.icons.outlined.ArrowForward
import androidx.compose.material.icons.outlined.Download
import androidx.compose.material.icons.outlined.FavoriteBorder
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Search
import androidx.compose.material.icons.rounded.Star
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextField
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavController
import coil.compose.AsyncImage
import androidx.compose.foundation.Image
import androidx.compose.ui.res.painterResource
import com.example.oppo_play.R
import com.example.oppo_play.model.StoreApp
import com.example.oppo_play.ui.components.ReviewsSection
import com.example.oppo_play.ui.components.WriteReviewDialog
import com.example.oppo_play.data.UserHistoryRepository
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import com.example.oppo_play.model.User
import com.example.oppo_play.model.InstallStatus

private enum class AppsSection { FOR_YOU, TOP_CHARTS, CATEGORIES, EDITORS }
private enum class ChartsSort { DOWNLOADS, RATING, RECENT }
private enum class GamesView { FOR_YOU, TOP, RECENT, INSTALLED }
private enum class KidsView { FOR_KIDS, TOP, LEARNING, RECENT }

@Composable
fun AppsScreen(
    navController: NavController,
    viewModel: MainViewModel,
    user: User?,
    activeDownloadsCount: Int,
    onProfileClick: () -> Unit,
    onDownloadsClick: () -> Unit
) {
    when (val state = viewModel.uiState) {
        is AppsUiState.Loading -> LoadingScreen()
        is AppsUiState.Error -> ErrorScreen(state.message) { viewModel.loadApps() }
        is AppsUiState.Success -> {
            val homeApps = remember(state.apps) {
                state.apps.sortedBy { it.title.lowercase() }.take(24)
            }
            AppsContent(navController, homeApps, viewModel, user, activeDownloadsCount, onProfileClick, onDownloadsClick)
        }
    }
}

@Composable
fun GamesScreen(navController: NavController, viewModel: MainViewModel) {
    when (val state = viewModel.uiState) {
        is AppsUiState.Loading -> LoadingScreen()
        is AppsUiState.Error -> ErrorScreen(state.message) { viewModel.loadApps() }
        is AppsUiState.Success -> GamesContent(navController, state.apps, viewModel)
    }
}

@Composable
fun KidsScreen(navController: NavController, viewModel: MainViewModel) {
    when (val state = viewModel.uiState) {
        is AppsUiState.Loading -> LoadingScreen()
        is AppsUiState.Error -> ErrorScreen(state.message) { viewModel.loadApps() }
        is AppsUiState.Success -> KidsContent(navController, state.apps, viewModel)
    }
}

@Composable
fun CategoryScreen(
    navController: NavController,
    viewModel: MainViewModel,
    categoryName: String
) {
    val apps = when (val state = viewModel.uiState) {
        is AppsUiState.Success -> {
            when (categoryName) {
                "recommended" -> state.apps.sortedByDescending { parseDownloads(it.downloads) }
                "top_rated" -> state.apps.sortedByDescending { it.rating }
                "new_updated" -> state.apps.sortedByDescending { it.updatedAtMillis }
                "games" -> state.apps.filter { it.category == "Games" }
                else -> state.apps.filter { it.category.equals(categoryName, ignoreCase = true) }
            }
        }
        else -> emptyList()
    }

    val title = when (categoryName) {
        "recommended" -> "Recommended for you"
        "top_rated" -> "Top rated"
        "new_updated" -> "New & updated"
        "games" -> "Games spotlight"
        else -> categoryName
    }

    val scrollState = rememberScrollState()
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Outlined.ArrowBack,
                contentDescription = "Back",
                modifier = Modifier
                    .size(24.dp)
                    .clickable { navController.popBackStack() }
            )
            Spacer(Modifier.width(16.dp))
            Text(
                title,
                style = MaterialTheme.typography.titleLarge,
                fontWeight = FontWeight.Normal
            )
        }

        Column(modifier = Modifier.padding(horizontal = 16.dp)) {
            Spacer(Modifier.height(8.dp))
            apps.forEach { app ->
                AppListRow(app = app, onClick = { navController.navigate("detail/${app.id}") })
            }
            Spacer(Modifier.height(96.dp))
        }
    }
}

@Composable
fun AppDetailScreen(
    navController: NavController,
    viewModel: MainViewModel,
    appId: String,
    userViewModel: UserViewModel,
    reviewViewModel: ReviewViewModel,
    installTaskViewModel: InstallTaskViewModel
) {
    val app = viewModel.appById(appId)
    if (app == null) {
        LoadingScreen()
        return
    }

    val user = userViewModel.user
    val scope = rememberCoroutineScope()
    val downloadTask = installTaskViewModel.getTaskForApp(appId)
    val installStatus = when {
        downloadTask?.status == InstallStatus.SUCCESS || app.isInstalled -> "installed"
        downloadTask?.status in listOf(InstallStatus.QUEUED, InstallStatus.DELIVERED, InstallStatus.DOWNLOADING) -> "downloading"
        downloadTask?.status == InstallStatus.INSTALLING -> "installing"
        downloadTask?.status == InstallStatus.FAILED -> "failed"
        else -> "idle"
    }
    val downloadProgress = downloadTask?.progress ?: 0
    var showWriteReview by remember { mutableStateOf(false) }
    var isInWishlist by remember { mutableStateOf(false) }
    var wishlistLoading by remember { mutableStateOf(false) }
    val scrollState = rememberScrollState()

    LaunchedEffect(appId) {
        reviewViewModel.loadReviews(appId)
    }

    LaunchedEffect(appId, user?.id) {
        if (user != null) {
            isInWishlist = UserHistoryRepository.isInWishlist(user.id, appId)
        }
    }

    LaunchedEffect(reviewViewModel.submitState) {
        if (reviewViewModel.submitState is SubmitState.Success) {
            showWriteReview = false
            reviewViewModel.resetSubmitState()
        }
    }

    if (showWriteReview) {
        WriteReviewDialog(
            appTitle = app.title,
            onDismiss = { showWriteReview = false },
            onSubmit = { rating, content ->
                reviewViewModel.submitReview(appId, rating, content)
            },
            isSubmitting = reviewViewModel.submitState is SubmitState.Submitting
        )
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
    ) {
        // Top bar
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 8.dp, vertical = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Icon(
                imageVector = Icons.Outlined.ArrowBack,
                contentDescription = "Back",
                modifier = Modifier
                    .size(24.dp)
                    .clickable { navController.popBackStack() }
            )
        }

        // App header
        Column(modifier = Modifier.padding(horizontal = 16.dp)) {
            Row(horizontalArrangement = Arrangement.spacedBy(16.dp)) {
                AppIcon(app, size = 72.dp, radius = 16.dp)
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        app.title,
                        style = MaterialTheme.typography.titleLarge,
                        fontWeight = FontWeight.Normal,
                        maxLines = 2,
                        overflow = TextOverflow.Ellipsis
                    )
                    Spacer(Modifier.height(4.dp))
                    Text(
                        app.developer,
                        color = MaterialTheme.colorScheme.primary,
                        fontSize = 14.sp
                    )
                    Spacer(Modifier.height(4.dp))
                    Text(
                        "Contains ads · In-app purchases",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Spacer(Modifier.height(16.dp))

            // Stats row (Google Play style)
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            String.format("%.1f", app.rating),
                            fontSize = 14.sp,
                            fontWeight = FontWeight.Medium
                        )
                        Text(" ★", fontSize = 12.sp)
                    }
                    Text(
                        "reviews",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                Box(
                    modifier = Modifier
                        .width(1.dp)
                        .height(32.dp)
                        .background(MaterialTheme.colorScheme.outlineVariant)
                )
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        app.downloads,
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium
                    )
                    Text(
                        "Downloads",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
                Box(
                    modifier = Modifier
                        .width(1.dp)
                        .height(32.dp)
                        .background(MaterialTheme.colorScheme.outlineVariant)
                )
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(
                        if (app.size.isNotBlank()) app.size else "Varies",
                        fontSize = 14.sp,
                        fontWeight = FontWeight.Medium
                    )
                    Text(
                        "Size",
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }

            Spacer(Modifier.height(16.dp))

            // Install button (full width, Google Play style)
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                InstallButton(
                    status = installStatus,
                    progress = downloadProgress,
                    onClick = {
                        if (installStatus == "installed") return@InstallButton
                        if (installStatus != "idle" && installStatus != "failed") return@InstallButton
                        installTaskViewModel.startDownload(app.id)
                    },
                    modifier = Modifier.weight(1f)
                )
                WishlistButton(
                    isInWishlist = isInWishlist,
                    isLoading = wishlistLoading,
                    onClick = {
                        if (user == null) {
                            userViewModel.showLogin()
                            return@WishlistButton
                        }
                        wishlistLoading = true
                        scope.launch {
                            if (isInWishlist) {
                                if (UserHistoryRepository.removeFromWishlist(user.id, app.id)) {
                                    isInWishlist = false
                                }
                            } else {
                                if (UserHistoryRepository.addToWishlist(user.id, app.id)) {
                                    isInWishlist = true
                                }
                            }
                            wishlistLoading = false
                        }
                    }
                )
            }
        }

        // About section
        Column(modifier = Modifier.padding(horizontal = 16.dp)) {
            Spacer(Modifier.height(24.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    "About this app",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Normal
                )
                Icon(
                    Icons.Outlined.ArrowForward,
                    contentDescription = null,
                    modifier = Modifier.size(20.dp),
                    tint = MaterialTheme.colorScheme.onSurface
                )
            }
            Spacer(Modifier.height(12.dp))
            Text(
                app.description,
                fontSize = 14.sp,
                lineHeight = 20.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 4,
                overflow = TextOverflow.Ellipsis
            )
            Spacer(Modifier.height(12.dp))
            Row(
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                Surface(
                    shape = RoundedCornerShape(8.dp),
                    color = MaterialTheme.colorScheme.surfaceVariant
                ) {
                    Text(
                        app.category,
                        modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
                        fontSize = 12.sp
                    )
                }
            }
        }

        // Reviews section
        Column(modifier = Modifier.padding(horizontal = 16.dp)) {
            Spacer(Modifier.height(24.dp))
            ReviewsSection(
                uiState = reviewViewModel.uiState,
                currentUserName = userViewModel.user?.name,
                onWriteReview = {
                    if (userViewModel.requireUser()) {
                        showWriteReview = true
                    }
                },
                onDeleteReview = { reviewId ->
                    reviewViewModel.deleteReview(reviewId)
                }
            )
        }

        // Data safety section
        Column(modifier = Modifier.padding(horizontal = 16.dp)) {
            Spacer(Modifier.height(24.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    "Data safety",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Normal
                )
                Icon(
                    Icons.Outlined.ArrowForward,
                    contentDescription = null,
                    modifier = Modifier.size(20.dp),
                    tint = MaterialTheme.colorScheme.onSurface
                )
            }
            Spacer(Modifier.height(12.dp))
            Text(
                "Safety starts with understanding how developers collect and share your data.",
                fontSize = 14.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                lineHeight = 20.sp
            )
        }

        // Similar apps section
        Column(modifier = Modifier.padding(horizontal = 16.dp)) {
            Spacer(Modifier.height(24.dp))
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    "Similar apps",
                    style = MaterialTheme.typography.titleMedium,
                    fontWeight = FontWeight.Normal
                )
                Icon(
                    Icons.Outlined.ArrowForward,
                    contentDescription = null,
                    modifier = Modifier.size(20.dp),
                    tint = MaterialTheme.colorScheme.onSurface
                )
            }
            Spacer(Modifier.height(12.dp))
            SimilarRow(
                items = viewModel.uiState.let {
                    if (it is AppsUiState.Success) {
                        it.apps.filter { other -> other.category == app.category && other.id != app.id }.take(6)
                    } else emptyList()
                },
                onClick = { navController.navigate("detail/$it") }
            )
        }

        Spacer(Modifier.height(96.dp))
    }
}

// ---------- Apps tab ----------

@Composable
private fun AppsContent(
    navController: NavController,
    allApps: List<StoreApp>,
    viewModel: MainViewModel,
    user: User?,
    activeDownloadsCount: Int,
    onProfileClick: () -> Unit,
    onDownloadsClick: () -> Unit
) {
    var section by rememberSaveable { mutableStateOf(AppsSection.FOR_YOU) }
    var sort by rememberSaveable { mutableStateOf(ChartsSort.DOWNLOADS) }
    var query by rememberSaveable { mutableStateOf("") }
    var categoryFilter by rememberSaveable { mutableStateOf<String?>(null) }

    val filteredApps = categoryFilter?.let { cat -> allApps.filter { it.category == cat } } ?: allApps
    val searchTerm = query.trim()

    val scrollState = rememberScrollState()
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(horizontal = 16.dp)
    ) {
        Spacer(Modifier.height(8.dp))
        TopHeaderSearch(
            query = query,
            onQueryChange = { query = it },
            user = user,
            activeDownloadsCount = activeDownloadsCount,
            onProfileClick = onProfileClick,
            onDownloadsClick = onDownloadsClick
        )
        Spacer(Modifier.height(12.dp))
        AppsSectionChips(
            selected = section,
            onSelected = { new ->
                section = new
                if (new == AppsSection.FOR_YOU) categoryFilter = categoryFilter // no-op
            },
            onKidsClick = { navController.navigate(PlayDestination.Kids.route) }
        )
        Spacer(Modifier.height(8.dp))
        CategoryFilterChips(
            selected = categoryFilter,
            categories = listOf("Productivity", "Games", "Entertainment", "Health & Fitness", "Education"),
            onSelected = { categoryFilter = it },
            onClear = { categoryFilter = null }
        )

        Spacer(Modifier.height(16.dp))

        if (searchTerm.isNotEmpty()) {
            val results = filteredApps.filter {
                it.title.contains(searchTerm, ignoreCase = true) ||
                    it.developer.contains(searchTerm, ignoreCase = true) ||
                    it.category.contains(searchTerm, ignoreCase = true)
            }
            SectionTitle("Results for \"$searchTerm\"${categoryFilter?.let { " · $it" } ?: ""}")
            Spacer(Modifier.height(8.dp))
            AppGrid(results, onAppClick = { navController.navigate("detail/$it") })
            if (results.isEmpty()) {
                Spacer(Modifier.height(16.dp))
                Text("No results found", color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
            return
        }

        when (section) {
            AppsSection.TOP_CHARTS -> {
                ChartsSortChips(selected = sort, onSelected = { sort = it })
                Spacer(Modifier.height(12.dp))
                val sorted = when (sort) {
                    ChartsSort.RATING -> filteredApps.sortedByDescending { it.rating }
                    ChartsSort.RECENT -> filteredApps.sortedByDescending { it.updatedAtMillis }
                    ChartsSort.DOWNLOADS -> sortByDownloads(filteredApps)
                }.take(12)
                TopChartsList(sorted, onAppClick = { navController.navigate("detail/$it") })
            }
            AppsSection.CATEGORIES -> {
                val counts = allApps.groupingBy { it.category }.eachCount()
                val categories = counts.entries.sortedByDescending { it.value }
                SectionTitle("Browse by category")
                Spacer(Modifier.height(8.dp))
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    categories.forEach { (name, count) ->
                        CategoryRowItem(
                            name = name,
                            count = count,
                            selected = categoryFilter == name,
                            onClick = { categoryFilter = name; section = AppsSection.FOR_YOU }
                        )
                    }
                }
            }
            AppsSection.EDITORS -> {
                val editorsChoice = filteredApps.filter { it.rating >= 4.7 || it.downloads.contains("B") }.take(12)
                SectionTitle("Editors' Choice")
                Spacer(Modifier.height(8.dp))
                AppGrid(editorsChoice, onAppClick = { navController.navigate("detail/$it") })
            }
            AppsSection.FOR_YOU -> {
                HeroBanner(
                    onTopCharts = { section = AppsSection.TOP_CHARTS },
                    onEditors = { section = AppsSection.EDITORS },
                    onGames = { navController.navigate(PlayDestination.Games.route) }
                )
                Spacer(Modifier.height(14.dp))

                val usedIds = mutableSetOf<String>()

                val recommended = sortByDownloads(filteredApps).take(3)
                usedIds.addAll(recommended.map { it.id })
                AppsSectionBlock(
                    title = "Recommended for you",
                    onMore = { navController.navigate("category/recommended") },
                    apps = recommended,
                    onAppClick = { navController.navigate("detail/$it") }
                )

                val topRated = filteredApps
                    .filter { it.id !in usedIds }
                    .sortedByDescending { it.rating }
                    .take(3)
                usedIds.addAll(topRated.map { it.id })
                AppsSectionBlock(
                    title = "Top rated",
                    onMore = { navController.navigate("category/top_rated") },
                    apps = topRated,
                    onAppClick = { navController.navigate("detail/$it") }
                )

                val recent = filteredApps
                    .filter { it.id !in usedIds }
                    .sortedByDescending { it.updatedAtMillis }
                    .take(3)
                usedIds.addAll(recent.map { it.id })
                AppsSectionBlock(
                    title = "New & updated",
                    onMore = { navController.navigate("category/new_updated") },
                    apps = recent,
                    onAppClick = { navController.navigate("detail/$it") }
                )

                val gamesSpotlight = filteredApps
                    .filter { it.category == "Games" && it.id !in usedIds }
                    .take(3)
                if (gamesSpotlight.isNotEmpty()) {
                    AppsSectionBlock(
                        title = "Games spotlight",
                        onMore = { navController.navigate("category/games") },
                        apps = gamesSpotlight,
                        onAppClick = { navController.navigate("detail/$it") }
                    )
                }
            }
        }
        Spacer(Modifier.height(96.dp))
    }
}

// ---------- Games tab ----------

@Composable
private fun GamesContent(navController: NavController, allApps: List<StoreApp>, viewModel: MainViewModel) {
    var view by rememberSaveable { mutableStateOf(GamesView.FOR_YOU) }
    var query by rememberSaveable { mutableStateOf("") }

    val games = allApps.filter { it.category == "Games" }
    val searchTerm = query.trim()
    val searched = if (searchTerm.isNotEmpty()) {
        games.filter {
            it.title.contains(searchTerm, ignoreCase = true) ||
                it.developer.contains(searchTerm, ignoreCase = true)
        }
    } else games

    val scrollState = rememberScrollState()
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(horizontal = 16.dp)
    ) {
        Spacer(Modifier.height(8.dp))
        PageTitleWithSearch(title = "Games", hint = "Search for games", query = query, onQueryChange = { query = it })
        Spacer(Modifier.height(8.dp))
        GamesViewChips(selected = view, onSelected = { view = it })
        Spacer(Modifier.height(16.dp))

        if (searchTerm.isNotEmpty()) {
            searched.forEach { app ->
                AppListRow(app = app, onClick = { navController.navigate("detail/${app.id}") })
            }
        } else {
            when (view) {
                GamesView.FOR_YOU -> {
                    val usedIds = mutableSetOf<String>()

                    val topGames = sortByDownloads(games).take(3)
                    usedIds.addAll(topGames.map { it.id })
                    AppsSectionBlock(
                        title = "Top games",
                        onMore = { navController.navigate("category/games") },
                        apps = topGames,
                        onAppClick = { navController.navigate("detail/$it") }
                    )

                    val topRated = games
                        .filter { it.id !in usedIds }
                        .sortedByDescending { it.rating }
                        .take(3)
                    usedIds.addAll(topRated.map { it.id })
                    AppsSectionBlock(
                        title = "Top rated games",
                        onMore = { navController.navigate("category/games") },
                        apps = topRated,
                        onAppClick = { navController.navigate("detail/$it") }
                    )

                    val recent = games
                        .filter { it.id !in usedIds }
                        .sortedByDescending { it.updatedAtMillis }
                        .take(3)
                    AppsSectionBlock(
                        title = "New games",
                        onMore = { navController.navigate("category/games") },
                        apps = recent,
                        onAppClick = { navController.navigate("detail/$it") }
                    )
                }
                GamesView.TOP -> {
                    games.sortedByDescending { it.rating }.forEach { app ->
                        AppListRow(app = app, onClick = { navController.navigate("detail/${app.id}") })
                    }
                }
                GamesView.RECENT -> {
                    games.sortedByDescending { it.updatedAtMillis }.forEach { app ->
                        AppListRow(app = app, onClick = { navController.navigate("detail/${app.id}") })
                    }
                }
                GamesView.INSTALLED -> {
                    val installed = games.filter { it.isInstalled }
                    if (installed.isEmpty()) {
                        Text("No installed games", color = MaterialTheme.colorScheme.onSurfaceVariant)
                    } else {
                        installed.forEach { app ->
                            AppListRow(app = app, onClick = { navController.navigate("detail/${app.id}") })
                        }
                    }
                }
            }
        }
        Spacer(Modifier.height(96.dp))
    }
}

// ---------- Kids tab ----------

@Composable
private fun KidsContent(navController: NavController, allApps: List<StoreApp>, viewModel: MainViewModel) {
    var view by rememberSaveable { mutableStateOf(KidsView.FOR_KIDS) }
    var query by rememberSaveable { mutableStateOf("") }

    val kidsApps = allApps.filter { it.category == "Kids" || it.category == "Education" }
    val searchTerm = query.trim()
    val searched = if (searchTerm.isNotEmpty()) {
        kidsApps.filter {
            it.title.contains(searchTerm, ignoreCase = true) ||
                it.developer.contains(searchTerm, ignoreCase = true)
        }
    } else kidsApps

    val scrollState = rememberScrollState()
    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(scrollState)
            .padding(horizontal = 16.dp)
    ) {
        Spacer(Modifier.height(8.dp))
        PageTitleWithSearch(title = "Kids", hint = "Search for kids apps", query = query, onQueryChange = { query = it })
        Spacer(Modifier.height(8.dp))
        KidsViewChips(selected = view, onSelected = { view = it })
        Spacer(Modifier.height(16.dp))

        if (searchTerm.isNotEmpty()) {
            searched.forEach { app ->
                AppListRow(app = app, onClick = { navController.navigate("detail/${app.id}") })
            }
        } else {
            when (view) {
                KidsView.FOR_KIDS -> {
                    val usedIds = mutableSetOf<String>()

                    val topKids = sortByDownloads(kidsApps).take(3)
                    usedIds.addAll(topKids.map { it.id })
                    AppsSectionBlock(
                        title = "Popular for kids",
                        onMore = { navController.navigate("category/Kids") },
                        apps = topKids,
                        onAppClick = { navController.navigate("detail/$it") }
                    )

                    val education = kidsApps
                        .filter { it.category == "Education" && it.id !in usedIds }
                        .take(3)
                    usedIds.addAll(education.map { it.id })
                    AppsSectionBlock(
                        title = "Education",
                        onMore = { navController.navigate("category/Education") },
                        apps = education,
                        onAppClick = { navController.navigate("detail/$it") }
                    )

                    val recent = kidsApps
                        .filter { it.id !in usedIds }
                        .sortedByDescending { it.updatedAtMillis }
                        .take(3)
                    AppsSectionBlock(
                        title = "New for kids",
                        onMore = { navController.navigate("category/Kids") },
                        apps = recent,
                        onAppClick = { navController.navigate("detail/$it") }
                    )
                }
                KidsView.TOP -> {
                    kidsApps.sortedByDescending { it.rating }.forEach { app ->
                        AppListRow(app = app, onClick = { navController.navigate("detail/${app.id}") })
                    }
                }
                KidsView.LEARNING -> {
                    val learning = kidsApps.filter {
                        it.category == "Education" ||
                            it.title.contains("learn", ignoreCase = true) ||
                            it.description.contains("learn", ignoreCase = true)
                    }
                    learning.forEach { app ->
                        AppListRow(app = app, onClick = { navController.navigate("detail/${app.id}") })
                    }
                }
                KidsView.RECENT -> {
                    kidsApps.sortedByDescending { it.updatedAtMillis }.forEach { app ->
                        AppListRow(app = app, onClick = { navController.navigate("detail/${app.id}") })
                    }
                }
            }
        }
        Spacer(Modifier.height(96.dp))
    }
}

// ---------- Reusable UI ----------

@Composable
private fun LoadingScreen() {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        CircularProgressIndicator()
    }
}

@Composable
private fun ErrorScreen(message: String, onRetry: () -> Unit) {
    Box(modifier = Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        Column(horizontalAlignment = Alignment.CenterHorizontally) {
            Text(message, color = MaterialTheme.colorScheme.error)
            Spacer(Modifier.height(8.dp))
            OutlinedButton(onClick = onRetry) { Text("Retry") }
        }
    }
}

@Composable
private fun TopHeaderSearch(
    query: String,
    onQueryChange: (String) -> Unit,
    user: User?,
    activeDownloadsCount: Int,
    onProfileClick: () -> Unit,
    onDownloadsClick: () -> Unit
) {
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .height(48.dp),
        shape = RoundedCornerShape(24.dp),
        color = MaterialTheme.colorScheme.surfaceVariant.copy(alpha = 0.6f)
    ) {
        Row(
            modifier = Modifier
                .fillMaxSize()
                .padding(horizontal = 8.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            Image(
                painter = painterResource(id = R.drawable.ic_op_play),
                contentDescription = "OP Play",
                modifier = Modifier
                    .size(32.dp)
                    .clip(RoundedCornerShape(8.dp))
            )
            Spacer(Modifier.width(12.dp))
            Box(
                modifier = Modifier
                    .weight(1f)
                    .clickable { }
            ) {
                if (query.isEmpty()) {
                    Text(
                        "Search for apps & games",
                        color = MaterialTheme.colorScheme.onSurfaceVariant,
                        fontSize = 16.sp
                    )
                } else {
                    Text(query, fontSize = 16.sp)
                }
            }
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clickable(onClick = onDownloadsClick),
                contentAlignment = Alignment.Center
            ) {
                Icon(
                    Icons.Outlined.Download,
                    contentDescription = "Downloads",
                    tint = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.size(22.dp)
                )
                if (activeDownloadsCount > 0) {
                    Box(
                        modifier = Modifier
                            .align(Alignment.TopEnd)
                            .size(14.dp)
                            .clip(CircleShape)
                            .background(MaterialTheme.colorScheme.error),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = if (activeDownloadsCount > 9) "9+" else activeDownloadsCount.toString(),
                            color = Color.White,
                            fontSize = 8.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
            Spacer(Modifier.width(4.dp))
            Surface(
                modifier = Modifier
                    .size(32.dp)
                    .clickable(onClick = onProfileClick),
                color = if (user != null) MaterialTheme.colorScheme.primaryContainer
                       else MaterialTheme.colorScheme.surfaceVariant,
                shape = CircleShape
            ) {
                Box(contentAlignment = Alignment.Center) {
                    if (user != null) {
                        Text(
                            user.name.firstOrNull()?.uppercase() ?: "?",
                            color = MaterialTheme.colorScheme.onPrimaryContainer,
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp
                        )
                    } else {
                        Icon(
                            Icons.Outlined.Person,
                            contentDescription = "Sign in",
                            tint = MaterialTheme.colorScheme.onSurfaceVariant,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun PageTitleWithSearch(title: String, hint: String, query: String, onQueryChange: (String) -> Unit) {
    Text(title, style = MaterialTheme.typography.headlineMedium, fontWeight = FontWeight.Medium)
    Spacer(Modifier.height(8.dp))
    SearchField(query = query, hint = hint, onQueryChange = onQueryChange)
}

@Composable
private fun SearchField(query: String, hint: String, onQueryChange: (String) -> Unit) {
    TextField(
        value = query,
        onValueChange = onQueryChange,
        placeholder = { Text(hint, fontSize = 14.sp) },
        leadingIcon = { Icon(Icons.Outlined.Search, contentDescription = null) },
        singleLine = true,
        modifier = Modifier.fillMaxWidth(),
        shape = RoundedCornerShape(10.dp),
        colors = TextFieldDefaults.colors(
            focusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
            unfocusedContainerColor = MaterialTheme.colorScheme.surfaceVariant,
            disabledContainerColor = MaterialTheme.colorScheme.surfaceVariant,
            focusedIndicatorColor = Color.Transparent,
            unfocusedIndicatorColor = Color.Transparent
        )
    )
}

@Composable
private fun AppsSectionChips(
    selected: AppsSection,
    onSelected: (AppsSection) -> Unit,
    onKidsClick: () -> Unit
) {
    val scroll = rememberScrollState()
    Row(
        modifier = Modifier
            .horizontalScroll(scroll)
            .fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        SectionChip("For you", selected == AppsSection.FOR_YOU) { onSelected(AppsSection.FOR_YOU) }
        SectionChip("Top charts", selected == AppsSection.TOP_CHARTS) { onSelected(AppsSection.TOP_CHARTS) }
        SectionChip("Kids", false) { onKidsClick() }
        SectionChip("Categories", selected == AppsSection.CATEGORIES) { onSelected(AppsSection.CATEGORIES) }
        SectionChip("Editors' Choice", selected == AppsSection.EDITORS) { onSelected(AppsSection.EDITORS) }
    }
}

@Composable
private fun GamesViewChips(selected: GamesView, onSelected: (GamesView) -> Unit) {
    val scroll = rememberScrollState()
    Row(
        modifier = Modifier.horizontalScroll(scroll),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        SectionChip("For you", selected == GamesView.FOR_YOU) { onSelected(GamesView.FOR_YOU) }
        SectionChip("Top charts", selected == GamesView.TOP) { onSelected(GamesView.TOP) }
        SectionChip("New & updated", selected == GamesView.RECENT) { onSelected(GamesView.RECENT) }
        SectionChip("Installed", selected == GamesView.INSTALLED) { onSelected(GamesView.INSTALLED) }
    }
}

@Composable
private fun KidsViewChips(selected: KidsView, onSelected: (KidsView) -> Unit) {
    val scroll = rememberScrollState()
    Row(
        modifier = Modifier.horizontalScroll(scroll),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        SectionChip("For kids", selected == KidsView.FOR_KIDS) { onSelected(KidsView.FOR_KIDS) }
        SectionChip("Top charts", selected == KidsView.TOP) { onSelected(KidsView.TOP) }
        SectionChip("Learning", selected == KidsView.LEARNING) { onSelected(KidsView.LEARNING) }
        SectionChip("New", selected == KidsView.RECENT) { onSelected(KidsView.RECENT) }
    }
}

@Composable
private fun ChartsSortChips(selected: ChartsSort, onSelected: (ChartsSort) -> Unit) {
    val scroll = rememberScrollState()
    Row(
        modifier = Modifier.horizontalScroll(scroll),
        horizontalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        SectionChip("Top free", selected == ChartsSort.DOWNLOADS) { onSelected(ChartsSort.DOWNLOADS) }
        SectionChip("Top rated", selected == ChartsSort.RATING) { onSelected(ChartsSort.RATING) }
        SectionChip("New & updated", selected == ChartsSort.RECENT) { onSelected(ChartsSort.RECENT) }
    }
}

@Composable
private fun CategoryFilterChips(
    selected: String?,
    categories: List<String>,
    onSelected: (String) -> Unit,
    onClear: () -> Unit
) {
    val scroll = rememberScrollState()
    Row(
        modifier = Modifier.horizontalScroll(scroll),
        horizontalArrangement = Arrangement.spacedBy(6.dp)
    ) {
        categories.forEach { cat ->
            AssistChip(
                label = cat,
                selected = selected == cat,
                onClick = { onSelected(cat) }
            )
        }
        if (selected != null) {
            AssistChip(label = "Clear", selected = false, onClick = onClear)
        }
    }
}

@Composable
private fun AssistChip(label: String, selected: Boolean, onClick: () -> Unit) {
    val bg = if (selected) MaterialTheme.colorScheme.secondary.copy(alpha = 0.12f) else MaterialTheme.colorScheme.surface
    val border = if (selected) MaterialTheme.colorScheme.secondary else MaterialTheme.colorScheme.outlineVariant
    val textColor = if (selected) MaterialTheme.colorScheme.secondary else MaterialTheme.colorScheme.onSurfaceVariant
    Surface(
        modifier = Modifier
            .clip(RoundedCornerShape(50))
            .border(1.dp, border, RoundedCornerShape(50))
            .clickable(onClick = onClick),
        color = bg
    ) {
        Text(
            label,
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 6.dp),
            fontSize = 12.sp,
            color = textColor
        )
    }
}

@Composable
private fun SectionChip(label: String, selected: Boolean, onClick: () -> Unit) {
    val bg = if (selected) MaterialTheme.colorScheme.secondaryContainer else Color.Transparent
    val border = if (selected) Color.Transparent else MaterialTheme.colorScheme.outline.copy(alpha = 0.5f)
    val textColor = if (selected) MaterialTheme.colorScheme.onSecondaryContainer else MaterialTheme.colorScheme.onSurfaceVariant
    Surface(
        modifier = Modifier
            .clip(RoundedCornerShape(8.dp))
            .then(if (!selected) Modifier.border(1.dp, border, RoundedCornerShape(8.dp)) else Modifier)
            .clickable(onClick = onClick),
        color = bg
    ) {
        Text(
            label,
            modifier = Modifier.padding(horizontal = 16.dp, vertical = 8.dp),
            fontSize = 14.sp,
            color = textColor
        )
    }
}

@OptIn(ExperimentalFoundationApi::class)
@Composable
private fun HeroBanner(
    onTopCharts: () -> Unit,
    onEditors: () -> Unit,
    onGames: () -> Unit
) {
    data class BannerItem(
        val title: String,
        val subtitle: String,
        val colors: List<Color>,
        val onClick: () -> Unit
    )

    val banners = listOf(
        BannerItem(
            title = "Top Charts",
            subtitle = "See what's trending",
            colors = listOf(Color(0xFF667EEA), Color(0xFF764BA2)),
            onClick = onTopCharts
        ),
        BannerItem(
            title = "Editors' Choice",
            subtitle = "Handpicked quality apps",
            colors = listOf(Color(0xFF11998E), Color(0xFF38EF7D)),
            onClick = onEditors
        ),
        BannerItem(
            title = "Games",
            subtitle = "Play something new",
            colors = listOf(Color(0xFFFC466B), Color(0xFF3F5EFB)),
            onClick = onGames
        )
    )

    val pagerState = rememberPagerState(pageCount = { banners.size })

    LaunchedEffect(Unit) {
        while (true) {
            delay(4000)
            val next = (pagerState.currentPage + 1) % banners.size
            pagerState.animateScrollToPage(next)
        }
    }

    Column {
        HorizontalPager(
            state = pagerState,
            modifier = Modifier.fillMaxWidth()
        ) { page ->
            val banner = banners[page]
            Box(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 4.dp)
                    .height(72.dp)
                    .clip(RoundedCornerShape(12.dp))
                    .background(Brush.horizontalGradient(banner.colors))
                    .clickable(onClick = banner.onClick)
                    .padding(horizontal = 16.dp),
                contentAlignment = Alignment.CenterStart
            ) {
                Column {
                    Text(
                        banner.title,
                        color = Color.White,
                        fontSize = 16.sp,
                        fontWeight = FontWeight.SemiBold
                    )
                    Text(
                        banner.subtitle,
                        color = Color.White.copy(alpha = 0.85f),
                        fontSize = 12.sp
                    )
                }
            }
        }

        Spacer(Modifier.height(8.dp))

        Row(
            modifier = Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.Center
        ) {
            repeat(banners.size) { index ->
                Box(
                    modifier = Modifier
                        .padding(horizontal = 3.dp)
                        .size(if (pagerState.currentPage == index) 6.dp else 5.dp)
                        .clip(CircleShape)
                        .background(
                            if (pagerState.currentPage == index)
                                MaterialTheme.colorScheme.primary
                            else
                                MaterialTheme.colorScheme.onSurface.copy(alpha = 0.2f)
                        )
                )
            }
        }
    }
}

@Composable
private fun AppsSectionBlock(
    title: String,
    onMore: () -> Unit,
    apps: List<StoreApp>,
    onAppClick: (String) -> Unit
) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onMore)
            .padding(vertical = 8.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(
            title,
            style = MaterialTheme.typography.titleMedium,
            fontWeight = FontWeight.Medium,
            color = MaterialTheme.colorScheme.onSurface
        )
        Icon(
            imageVector = Icons.Outlined.ArrowForward,
            contentDescription = "See more",
            modifier = Modifier.size(24.dp),
            tint = MaterialTheme.colorScheme.onSurface
        )
    }
    AppGrid(apps, onAppClick)
    Spacer(Modifier.height(16.dp))
}

@Composable
private fun SectionTitle(text: String) {
    Text(text, style = MaterialTheme.typography.titleLarge, fontWeight = FontWeight.Medium)
}

@Composable
private fun AppGrid(items: List<StoreApp>, onAppClick: (String) -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(0.dp)) {
        items.take(3).forEach { app ->
            AppListRow(app = app, onClick = { onAppClick(app.id) })
        }
    }
}

@Composable
private fun AppListRow(app: StoreApp, onClick: () -> Unit) {
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clickable(onClick = onClick)
            .padding(vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically
    ) {
        AppIcon(app, size = 64.dp, radius = 12.dp)
        Spacer(Modifier.width(16.dp))
        Column(modifier = Modifier.weight(1f)) {
            Text(
                app.title,
                fontSize = 15.sp,
                maxLines = 1,
                overflow = TextOverflow.Ellipsis
            )
            Spacer(Modifier.height(2.dp))
            Text(
                app.description.take(50) + if (app.description.length > 50) "..." else "",
                fontSize = 13.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant,
                maxLines = 2,
                overflow = TextOverflow.Ellipsis,
                lineHeight = 16.sp
            )
            Spacer(Modifier.height(4.dp))
            Row(verticalAlignment = Alignment.CenterVertically) {
                Text(
                    String.format("%.1f", app.rating),
                    fontSize = 13.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
                Text(
                    " ★",
                    fontSize = 11.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
private fun AppCard(app: StoreApp, onClick: () -> Unit) {
    Column(
        modifier = Modifier
            .width(80.dp)
            .clickable(onClick = onClick),
        horizontalAlignment = Alignment.Start
    ) {
        Box(
            modifier = Modifier
                .size(64.dp)
                .clip(RoundedCornerShape(16.dp))
        ) {
            AsyncImage(
                model = app.iconUrl,
                contentDescription = app.title,
                modifier = Modifier.fillMaxSize()
            )
        }
        Spacer(Modifier.height(8.dp))
        Text(
            app.title,
            fontSize = 12.sp,
            maxLines = 2,
            overflow = TextOverflow.Ellipsis,
            lineHeight = 14.sp,
            color = MaterialTheme.colorScheme.onSurface
        )
        Spacer(Modifier.height(2.dp))
        Row(verticalAlignment = Alignment.CenterVertically) {
            Text(
                String.format("%.1f", app.rating),
                fontSize = 12.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
            Text(
                " ★",
                fontSize = 10.sp,
                color = MaterialTheme.colorScheme.onSurfaceVariant
            )
        }
    }
}

@Composable
private fun TopChartsList(items: List<StoreApp>, onAppClick: (String) -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(0.dp)) {
        items.forEachIndexed { index, app ->
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .clickable { onAppClick(app.id) }
                    .padding(vertical = 8.dp),
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    "${index + 1}",
                    fontSize = 12.sp,
                    color = MaterialTheme.colorScheme.onSurfaceVariant,
                    modifier = Modifier.width(24.dp)
                )
                AppIcon(app, size = 56.dp, radius = 12.dp)
                Spacer(Modifier.width(12.dp))
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        app.title,
                        fontSize = 14.sp,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis
                    )
                    Text(
                        app.category,
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Text(
                            String.format("%.1f", app.rating),
                            fontSize = 12.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                        Text(
                            " ★",
                            fontSize = 10.sp,
                            color = MaterialTheme.colorScheme.onSurfaceVariant
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun CategoryRowItem(name: String, count: Int, selected: Boolean, onClick: () -> Unit) {
    val bg = if (selected) MaterialTheme.colorScheme.secondary.copy(alpha = 0.12f) else MaterialTheme.colorScheme.surface
    Surface(
        modifier = Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(12.dp))
            .border(1.dp, MaterialTheme.colorScheme.outlineVariant, RoundedCornerShape(12.dp))
            .clickable(onClick = onClick),
        color = bg
    ) {
        Row(
            modifier = Modifier.padding(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(12.dp)
        ) {
            Box(
                modifier = Modifier
                    .size(36.dp)
                    .clip(RoundedCornerShape(18.dp))
                    .background(MaterialTheme.colorScheme.secondary.copy(alpha = 0.12f)),
                contentAlignment = Alignment.Center
            ) {
                Text(name.firstOrNull()?.toString() ?: "", fontWeight = FontWeight.Bold, color = MaterialTheme.colorScheme.secondary)
            }
            Column(modifier = Modifier.weight(1f)) {
                Text(name, fontSize = 14.sp)
                Text("$count apps", fontSize = 12.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
            }
        }
    }
}

@Composable
private fun SimilarRow(items: List<StoreApp>, onClick: (String) -> Unit) {
    val scroll = rememberScrollState()
    Row(
        modifier = Modifier
            .horizontalScroll(scroll)
            .fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(12.dp)
    ) {
        items.forEach { app ->
            Column(
                modifier = Modifier
                    .width(80.dp)
                    .clickable { onClick(app.id) },
                horizontalAlignment = Alignment.Start
            ) {
                AppIcon(app, size = 64.dp, radius = 16.dp)
                Spacer(Modifier.height(8.dp))
                Text(
                    app.title,
                    fontSize = 12.sp,
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                    lineHeight = 14.sp
                )
                Spacer(Modifier.height(2.dp))
                Row(verticalAlignment = Alignment.CenterVertically) {
                    Text(
                        String.format("%.1f", app.rating),
                        fontSize = 12.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                    Text(
                        " ★",
                        fontSize = 10.sp,
                        color = MaterialTheme.colorScheme.onSurfaceVariant
                    )
                }
            }
        }
    }
}

@Composable
private fun AppIcon(app: StoreApp, size: androidx.compose.ui.unit.Dp, radius: androidx.compose.ui.unit.Dp) {
    AsyncImage(
        model = app.iconUrl,
        contentDescription = app.title,
        modifier = Modifier
            .size(size)
            .clip(RoundedCornerShape(radius))
    )
}

@Composable
private fun RatingRow(app: StoreApp, small: Boolean = false) {
    val font = if (small) 11.sp else 13.sp
    Row(verticalAlignment = Alignment.CenterVertically, horizontalArrangement = Arrangement.spacedBy(4.dp)) {
        Text(String.format("%.1f", app.rating), fontSize = font)
        Icon(Icons.Rounded.Star, contentDescription = null, tint = MaterialTheme.colorScheme.primary, modifier = Modifier.size(font.value.dp))
        Text("· ${app.downloads}", fontSize = font, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Composable
private fun StatsStrip(app: StoreApp) {
    val scroll = rememberScrollState()
    Row(
        modifier = Modifier
            .horizontalScroll(scroll)
            .fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        StatPill(label = "Rating", value = String.format("%.1f", app.rating))
        StatPill(label = "Downloads", value = app.downloads)
        if (app.size.isNotBlank()) StatPill(label = "Size", value = app.size)
        if (app.version.isNotBlank()) StatPill(label = "Version", value = app.version)
    }
}

@Composable
private fun StatPill(label: String, value: String) {
    Surface(
        modifier = Modifier.clip(RoundedCornerShape(12.dp)),
        color = MaterialTheme.colorScheme.surfaceVariant
    ) {
        Column(
            modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            Text(value, fontSize = 13.sp, fontWeight = FontWeight.Medium)
            Text(label, fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
        }
    }
}

@Composable
private fun InfoChips(app: StoreApp) {
    Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
        InfoChip("Category: ${app.category}")
        if (app.version.isNotBlank()) InfoChip("Version: ${app.version}")
        if (app.size.isNotBlank()) InfoChip("Size: ${app.size}")
    }
}

@Composable
private fun InfoChip(label: String) {
    Surface(
        modifier = Modifier.clip(RoundedCornerShape(8.dp)),
        color = MaterialTheme.colorScheme.surfaceVariant
    ) {
        Text(label, modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp), fontSize = 11.sp, color = MaterialTheme.colorScheme.onSurfaceVariant)
    }
}

@Composable
private fun ExpandableText(text: String, collapsedLines: Int = 4) {
    var expanded by remember { mutableStateOf(false) }
    Text(
        text = text,
        maxLines = if (expanded) Int.MAX_VALUE else collapsedLines,
        overflow = TextOverflow.Ellipsis,
        fontSize = 14.sp,
        lineHeight = 20.sp
    )
    if (!expanded && text.length > 140) {
        Text(
            "More",
            modifier = Modifier
                .padding(top = 4.dp)
                .clickable { expanded = true },
            color = MaterialTheme.colorScheme.primary,
            fontSize = 13.sp
        )
    }
}

@Composable
private fun InstallButton(
    status: String,
    progress: Int = 0,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    val isLoading = status in listOf("downloading", "installing")
    val bg = when (status) {
        "installed" -> MaterialTheme.colorScheme.secondaryContainer
        "downloading", "installing" -> MaterialTheme.colorScheme.primary
        else -> MaterialTheme.colorScheme.primary
    }
    val fg = when (status) {
        "installed" -> MaterialTheme.colorScheme.onSecondaryContainer
        else -> MaterialTheme.colorScheme.onPrimary
    }
    val label = when (status) {
        "installed" -> "Open"
        "downloading" -> "${progress}%"
        "installing" -> "Installing..."
        "failed" -> "Retry"
        else -> "Install"
    }
    Button(
        onClick = onClick,
        enabled = !isLoading,
        colors = ButtonDefaults.buttonColors(
            containerColor = bg,
            contentColor = fg,
            disabledContainerColor = bg.copy(alpha = 0.7f),
            disabledContentColor = fg.copy(alpha = 0.7f)
        ),
        shape = RoundedCornerShape(20.dp),
        modifier = modifier.height(40.dp)
    ) {
        if (isLoading) {
            CircularProgressIndicator(
                modifier = Modifier.size(16.dp),
                color = fg,
                strokeWidth = 2.dp
            )
            Spacer(Modifier.width(8.dp))
        }
        Text(label, fontSize = 14.sp, fontWeight = FontWeight.Medium)
    }
}

@Composable
private fun WishlistButton(
    isInWishlist: Boolean,
    isLoading: Boolean,
    onClick: () -> Unit
) {
    OutlinedButton(
        onClick = onClick,
        enabled = !isLoading,
        shape = RoundedCornerShape(10.dp),
        modifier = Modifier.size(48.dp),
        contentPadding = androidx.compose.foundation.layout.PaddingValues(0.dp)
    ) {
        if (isLoading) {
            CircularProgressIndicator(
                modifier = Modifier.size(20.dp),
                strokeWidth = 2.dp
            )
        } else {
            Icon(
                imageVector = if (isInWishlist) Icons.Filled.Favorite else Icons.Outlined.FavoriteBorder,
                contentDescription = if (isInWishlist) "Remove from wishlist" else "Add to wishlist",
                tint = if (isInWishlist) Color(0xFFE91E63) else MaterialTheme.colorScheme.onSurface
            )
        }
    }
}

// ---------- Sorting helpers ----------

private fun parseDownloads(value: String): Long {
    val match = Regex("([\\d.]+)\\s*([BMK])", RegexOption.IGNORE_CASE).find(value) ?: return 0L
    val amount = match.groupValues[1].toDoubleOrNull() ?: return 0L
    return when (match.groupValues[2].uppercase()) {
        "B" -> (amount * 1_000_000_000).toLong()
        "M" -> (amount * 1_000_000).toLong()
        else -> (amount * 1_000).toLong()
    }
}

private fun sortByDownloads(apps: List<StoreApp>): List<StoreApp> =
    apps.sortedWith(compareByDescending<StoreApp> { parseDownloads(it.downloads) }.thenByDescending { it.rating })
