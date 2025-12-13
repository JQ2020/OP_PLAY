package com.example.oppo_play.model

enum class InstallStatus {
    QUEUED,
    DELIVERED,
    DOWNLOADING,
    INSTALLING,
    SUCCESS,
    FAILED,
    CANCELED
}

data class InstallTask(
    val id: String,
    val appId: String,
    val appTitle: String,
    val appIconUrl: String,
    val status: InstallStatus,
    val progress: Int,
    val message: String?,
    val downloadUrl: String?,
    val simulateDuration: Int?,
    val fileSize: String?,
    val downloadSpeed: String?,
    val createdAt: Long?
)
