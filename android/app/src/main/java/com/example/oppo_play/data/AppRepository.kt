package com.example.oppo_play.data

import android.util.Log
import com.example.oppo_play.BuildConfig
import com.example.oppo_play.model.StoreApp
import java.text.SimpleDateFormat
import java.util.Locale
import java.util.TimeZone

object AppRepository {
    private const val TAG = "AppRepository"
    private val isoFormat = SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'", Locale.US).apply {
        timeZone = TimeZone.getTimeZone("UTC")
    }

    suspend fun fetchAppsPage(
        cursor: String? = null,
        limit: Int = 20,
        category: String? = null
    ): Pair<List<StoreApp>, String?> {
        val response = ApiClient.api.getApps(cursor, limit, category)
        if (BuildConfig.DEBUG) {
            Log.d(TAG, "fetchAppsPage: ${response.items.size} items, hasMore=${response.hasMore}")
        }
        val apps = response.items.map { it.toDomain() }
        return apps to response.nextCursor
    }

    suspend fun fetchAllApps(): List<StoreApp> {
        val allApps = mutableListOf<StoreApp>()
        var cursor: String? = null
        do {
            val (apps, nextCursor) = fetchAppsPage(cursor, 50)
            allApps.addAll(apps)
            cursor = nextCursor
        } while (cursor != null)
        if (BuildConfig.DEBUG) {
            Log.d(TAG, "fetchAllApps: ${allApps.size} total items")
        }
        return allApps
    }

    suspend fun fetchApp(id: String): StoreApp {
        val apiApp = ApiClient.api.getApp(id)
        if (BuildConfig.DEBUG) {
            Log.d(TAG, "fetchApp($id): $apiApp")
        }
        return apiApp.toDomain()
    }

    fun ApiApp.toDomain(): StoreApp {
        val icon = if (iconUrl.startsWith("http")) {
            iconUrl
        } else {
            ApiClient.BASE_URL.trimEnd('/') + iconUrl
        }
        return StoreApp(
            id = id,
            title = title,
            developer = developer,
            iconUrl = icon,
            description = description.orEmpty(),
            rating = rating,
            downloads = downloads,
            category = category,
            isInstalled = isInstalled,
            size = size.orEmpty(),
            version = version.orEmpty(),
            updatedAtMillis = parseIsoMillis(updatedAt)
        )
    }

    fun parseIsoMillis(value: String?): Long {
        if (value.isNullOrBlank()) return 0L
        return try {
            isoFormat.parse(value)?.time ?: 0L
        } catch (_: Exception) {
            0L
        }
    }
}
