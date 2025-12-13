package com.example.oppo_play.ui

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Apps
import androidx.compose.material.icons.outlined.BarChart
import androidx.compose.material.icons.outlined.ChildCare
import androidx.compose.material.icons.outlined.VideogameAsset
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.NavigationBarItemDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.NavHostController
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import androidx.lifecycle.viewmodel.compose.viewModel
import com.example.oppo_play.ui.components.AuthDialog
import com.example.oppo_play.ui.components.InstallTaskIndicator

sealed class PlayDestination(
    val route: String,
    val label: String,
    val icon: ImageVector
) {
    data object Apps : PlayDestination("apps", "Apps", Icons.Outlined.Apps)
    data object Games : PlayDestination("games", "Games", Icons.Outlined.VideogameAsset)
    data object Kids : PlayDestination("kids", "Kids", Icons.Outlined.ChildCare)
    // Kept for legacy screens still in the project (not in bottom bar).
    data object TopCharts : PlayDestination("top_charts", "Top charts", Icons.Outlined.BarChart)
}

val bottomDestinations = listOf(
    PlayDestination.Apps,
    PlayDestination.Games,
    PlayDestination.Kids
)

@Composable
fun PlayAppNavHost() {
    val navController = rememberNavController()
    val context = LocalContext.current
    val mainViewModel: MainViewModel = viewModel()
    val userViewModel: UserViewModel = viewModel()
    val reviewViewModel: ReviewViewModel = viewModel()
    val installTaskViewModel: InstallTaskViewModel = viewModel()

    val backStackEntry by navController.currentBackStackEntryAsState()
    val currentRoute = backStackEntry?.destination?.route
    val showBottomBar = bottomDestinations.any { currentRoute?.startsWith(it.route) == true }

    LaunchedEffect(Unit) {
        installTaskViewModel.init(context)
        installTaskViewModel.startPolling()
    }

    DisposableEffect(Unit) {
        onDispose {
            installTaskViewModel.stopPolling()
        }
    }

    if (userViewModel.showAuthDialog) {
        AuthDialog(
            isRegistering = userViewModel.isRegistering,
            authState = userViewModel.authState,
            onDismiss = { userViewModel.dismissAuthDialog() },
            onLogin = { email, password -> userViewModel.login(email, password) },
            onRegister = { name, email, password -> userViewModel.register(name, email, password) },
            onSwitchMode = { userViewModel.switchAuthMode() }
        )
    }

    Box {
        PlayScaffold(
            showBottomBar = showBottomBar,
            navController = navController
        ) { padding ->
            NavHost(
                navController = navController,
                startDestination = PlayDestination.Apps.route,
                modifier = Modifier.padding(padding)
            ) {
                composable(PlayDestination.Apps.route) {
                    AppsScreen(
                        navController = navController,
                        viewModel = mainViewModel,
                        user = userViewModel.user,
                        activeDownloadsCount = installTaskViewModel.activeTasks.size,
                        onProfileClick = {
                            if (userViewModel.user != null) {
                                navController.navigate("profile")
                            } else {
                                userViewModel.showLogin()
                            }
                        },
                        onDownloadsClick = {
                            navController.navigate("downloads")
                        }
                    )
                }
                composable(PlayDestination.Games.route) {
                    GamesScreen(navController, mainViewModel)
                }
                composable(PlayDestination.Kids.route) {
                    KidsScreen(navController, mainViewModel)
                }
                composable(
                    route = "detail/{itemId}",
                    arguments = listOf(navArgument("itemId") { defaultValue = "" })
                ) { entry ->
                    val id = entry.arguments?.getString("itemId") ?: ""
                    AppDetailScreen(
                        navController = navController,
                        viewModel = mainViewModel,
                        appId = id,
                        userViewModel = userViewModel,
                        reviewViewModel = reviewViewModel,
                        installTaskViewModel = installTaskViewModel
                    )
                }
                composable("profile") {
                    ProfileScreen(
                        navController = navController,
                        userViewModel = userViewModel
                    )
                }
                composable("downloads") {
                    DownloadsScreen(
                        navController = navController,
                        installTaskViewModel = installTaskViewModel
                    )
                }
            }
        }

        InstallTaskIndicator(
            task = installTaskViewModel.currentTask,
            modifier = Modifier.align(Alignment.BottomCenter)
        )
    }
}

@Composable
fun PlayScaffold(
    showBottomBar: Boolean,
    navController: NavHostController,
    content: @Composable (androidx.compose.foundation.layout.PaddingValues) -> Unit
) {
    Scaffold(
        bottomBar = {
            if (showBottomBar) {
                androidx.compose.material3.Surface(shadowElevation = 8.dp) {
                    PlayBottomBar(navController)
                }
            }
        },
        containerColor = MaterialTheme.colorScheme.background,
        content = content
    )
}

@Composable
fun PlayBottomBar(navController: NavHostController) {
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination

    NavigationBar {
        bottomDestinations.forEach { destination ->
            val selected = currentDestination?.hierarchy?.any { it.route == destination.route } == true
            NavigationBarItem(
                selected = selected,
                onClick = {
                    navController.navigate(destination.route) {
                        popUpTo(navController.graph.findStartDestination().id) {
                            saveState = true
                        }
                        launchSingleTop = true
                        restoreState = true
                    }
                },
                icon = { androidx.compose.material3.Icon(destination.icon, contentDescription = destination.label) },
                label = { Text(destination.label) },
                colors = NavigationBarItemDefaults.colors()
            )
        }
    }
}
