package com.example.oppo_play.data

import android.content.Context
import com.example.oppo_play.model.InstallStatus
import com.example.oppo_play.model.InstallTask

object InstallTaskRepository {

    suspend fun createTask(appId: String): InstallTask {
        val deviceId = DeviceRepository.getDeviceId()
        val request = CreateInstallTaskRequest(appId = appId, deviceId = deviceId)
        return ApiClient.api.createInstallTask(request).task.toDomain()
    }

    suspend fun fetchPendingTasks(context: Context): List<InstallTask> {
        val deviceId = DeviceRepository.getDeviceId()
        val response = ApiClient.api.getInstallTasks(
            deviceId = deviceId,
            status = "QUEUED",
            limit = 10
        )
        return response.tasks.map { it.toDomain() }
    }

    suspend fun fetchAllTasks(context: Context): List<InstallTask> {
        val deviceId = DeviceRepository.getDeviceId()
        val response = ApiClient.api.getInstallTasks(
            deviceId = deviceId,
            limit = 50
        )
        return response.tasks.map { it.toDomain() }
    }

    suspend fun fetchActiveTasks(): List<InstallTask> {
        val deviceId = DeviceRepository.getDeviceId()
        val response = ApiClient.api.getInstallTasks(
            deviceId = deviceId,
            limit = 20
        )
        return response.tasks
            .filter { it.status !in listOf("SUCCESS", "FAILED", "CANCELED") }
            .map { it.toDomain() }
    }

    suspend fun fetchTask(taskId: String): InstallTask {
        return ApiClient.api.getInstallTask(taskId).task.toDomain()
    }

    suspend fun updateTaskStatus(
        taskId: String,
        status: InstallStatus,
        progress: Int? = null,
        message: String? = null
    ): InstallTask {
        val request = UpdateTaskStatusRequest(
            status = status.name,
            progress = progress,
            message = message
        )
        return ApiClient.api.updateInstallTask(taskId, request).task.toDomain()
    }

    private fun ApiInstallTask.toDomain(): InstallTask {
        val iconUrl = app?.iconUrl?.let { url ->
            if (url.startsWith("http")) url
            else ApiClient.BASE_URL.trimEnd('/') + url
        } ?: ""

        return InstallTask(
            id = id,
            appId = app?.id ?: "",
            appTitle = app?.title ?: "Unknown",
            appIconUrl = iconUrl,
            status = try {
                InstallStatus.valueOf(status)
            } catch (_: Exception) {
                InstallStatus.QUEUED
            },
            progress = progress,
            message = message,
            downloadUrl = downloadUrl,
            simulateDuration = simulateDuration,
            fileSize = fileSize,
            downloadSpeed = downloadSpeed,
            createdAt = AppRepository.parseIsoMillis(createdAt)
        )
    }
}
