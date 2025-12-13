package com.example.oppo_play.ui.components

import androidx.compose.animation.*
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import coil.compose.AsyncImage
import com.example.oppo_play.model.InstallStatus
import com.example.oppo_play.model.InstallTask

@Composable
fun InstallTaskIndicator(
    task: InstallTask?,
    modifier: Modifier = Modifier
) {
    AnimatedVisibility(
        visible = task != null,
        modifier = modifier,
        enter = slideInVertically(initialOffsetY = { it }) + fadeIn(),
        exit = slideOutVertically(targetOffsetY = { it }) + fadeOut()
    ) {
        task?.let {
            Surface(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 16.dp, vertical = 8.dp),
                shape = RoundedCornerShape(16.dp),
                shadowElevation = 8.dp,
                color = MaterialTheme.colorScheme.primaryContainer
            ) {
                Row(
                    modifier = Modifier.padding(12.dp),
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    AsyncImage(
                        model = task.appIconUrl,
                        contentDescription = null,
                        modifier = Modifier
                            .size(48.dp)
                            .clip(RoundedCornerShape(12.dp))
                    )

                    Spacer(Modifier.width(12.dp))

                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = task.appTitle,
                            style = MaterialTheme.typography.bodyMedium,
                            fontWeight = FontWeight.Medium
                        )
                        Spacer(Modifier.height(4.dp))
                        Text(
                            text = getStatusText(task),
                            style = MaterialTheme.typography.bodySmall,
                            color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.8f)
                        )

                        if (task.status == InstallStatus.DOWNLOADING) {
                            Spacer(Modifier.height(6.dp))
                            LinearProgressIndicator(
                                progress = { task.progress / 100f },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(4.dp)
                                    .clip(RoundedCornerShape(2.dp)),
                            )
                            if (!task.downloadSpeed.isNullOrBlank()) {
                                Spacer(Modifier.height(4.dp))
                                Text(
                                    text = task.downloadSpeed,
                                    style = MaterialTheme.typography.labelSmall,
                                    color = MaterialTheme.colorScheme.onPrimaryContainer.copy(alpha = 0.7f),
                                    fontSize = 10.sp
                                )
                            }
                        }
                    }

                    Spacer(Modifier.width(8.dp))

                    when (task.status) {
                        InstallStatus.DOWNLOADING, InstallStatus.INSTALLING,
                        InstallStatus.QUEUED, InstallStatus.DELIVERED -> {
                            CircularProgressIndicator(
                                modifier = Modifier.size(24.dp),
                                strokeWidth = 2.dp,
                                color = MaterialTheme.colorScheme.primary
                            )
                        }
                        InstallStatus.SUCCESS -> {
                            Surface(
                                shape = RoundedCornerShape(50),
                                color = MaterialTheme.colorScheme.primary
                            ) {
                                Text(
                                    "✓",
                                    modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp),
                                    color = MaterialTheme.colorScheme.onPrimary
                                )
                            }
                        }
                        else -> {}
                    }
                }
            }
        }
    }
}

private fun getStatusText(task: InstallTask): String {
    return when (task.status) {
        InstallStatus.QUEUED -> "Waiting..."
        InstallStatus.DELIVERED -> "Preparing..."
        InstallStatus.DOWNLOADING -> {
            val msg = task.message
            if (!msg.isNullOrBlank()) msg else "Downloading ${task.progress}%"
        }
        InstallStatus.INSTALLING -> task.message ?: "Installing..."
        InstallStatus.SUCCESS -> "Installed successfully"
        InstallStatus.FAILED -> task.message ?: "Installation failed"
        InstallStatus.CANCELED -> "Canceled"
    }
}
