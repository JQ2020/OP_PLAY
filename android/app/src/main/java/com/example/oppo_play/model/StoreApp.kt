package com.example.oppo_play.model

/**
 * Domain model aligned to the App schema used by play-store-lite backend.
 */
data class StoreApp(
    val id: String,
    val title: String,
    val developer: String,
    val iconUrl: String,
    val description: String,
    val rating: Double,
    val downloads: String,
    val category: String,
    val isInstalled: Boolean = false,
    val size: String = "",
    val version: String = "",
    val updatedAtMillis: Long = 0L
)

