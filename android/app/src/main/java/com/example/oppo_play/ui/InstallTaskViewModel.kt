package com.example.oppo_play.ui

import android.content.Context
import android.util.Log
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.oppo_play.data.InstallTaskRepository
import com.example.oppo_play.data.UserHistoryRepository
import com.example.oppo_play.data.UserRepository
import com.example.oppo_play.model.InstallStatus
import com.example.oppo_play.model.InstallTask
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch

class InstallTaskViewModel : ViewModel() {
    var allTasks: List<InstallTask> by mutableStateOf(emptyList())
        private set

    var activeTasks: List<InstallTask> by mutableStateOf(emptyList())
        private set

    var currentTask: InstallTask? by mutableStateOf(null)
        private set

    private var pollingJob: Job? = null
    private var appContext: Context? = null

    companion object {
        private const val TAG = "InstallTaskViewModel"
        private const val POLL_INTERVAL_ACTIVE = 500L
        private const val POLL_INTERVAL_IDLE = 10_000L
    }

    fun init(context: Context) {
        appContext = context.applicationContext
    }

    fun startPolling() {
        if (appContext == null) return

        pollingJob?.cancel()
        pollingJob = viewModelScope.launch {
            while (isActive) {
                try {
                    val tasks = InstallTaskRepository.fetchAllTasks(appContext!!)
                    allTasks = tasks

                    val active = tasks.filter {
                        it.status !in listOf(InstallStatus.SUCCESS, InstallStatus.FAILED, InstallStatus.CANCELED)
                    }
                    activeTasks = active

                    // Update current task if still active
                    currentTask?.let { current ->
                        val updated = tasks.find { it.id == current.id }
                        if (updated != null) {
                            currentTask = updated
                            if (updated.status == InstallStatus.SUCCESS) {
                                // Record download history
                                recordDownloadHistory(updated.appId)
                                delay(2000)
                                currentTask = null
                            } else if (updated.status in listOf(InstallStatus.FAILED, InstallStatus.CANCELED)) {
                                delay(2000)
                                currentTask = null
                            }
                        } else {
                            currentTask = null
                        }
                    }

                    // If no current task, pick the first active one to display
                    if (currentTask == null && active.isNotEmpty()) {
                        currentTask = active.first()
                    }

                    Log.d(TAG, "Fetched ${tasks.size} tasks, ${active.size} active")
                } catch (e: Exception) {
                    Log.e(TAG, "Failed to fetch tasks", e)
                }

                val interval = if (activeTasks.isNotEmpty()) POLL_INTERVAL_ACTIVE else POLL_INTERVAL_IDLE
                delay(interval)
            }
        }
    }

    fun stopPolling() {
        pollingJob?.cancel()
        pollingJob = null
    }

    fun startDownload(appId: String) {
        viewModelScope.launch {
            try {
                val task = InstallTaskRepository.createTask(appId)
                currentTask = task
                // Remove existing tasks for the same app, then add the new one
                allTasks = allTasks.filter { it.appId != appId } + task
                activeTasks = activeTasks.filter { it.appId != appId } + task
                Log.d(TAG, "Created download task: ${task.id} for app: ${task.appTitle}")
            } catch (e: Exception) {
                Log.e(TAG, "Failed to create download task", e)
            }
        }
    }

    fun getTaskForApp(appId: String): InstallTask? {
        return allTasks.find { it.appId == appId && it.status != InstallStatus.CANCELED }
    }

    fun hasActiveDownload(appId: String): Boolean {
        return activeTasks.any { it.appId == appId }
    }

    private fun recordDownloadHistory(appId: String) {
        val userId = UserRepository.getUser()?.id ?: return
        viewModelScope.launch {
            try {
                UserHistoryRepository.recordDownload(userId, appId)
            } catch (e: Exception) {
                Log.e(TAG, "Failed to record download history", e)
            }
        }
    }
}
