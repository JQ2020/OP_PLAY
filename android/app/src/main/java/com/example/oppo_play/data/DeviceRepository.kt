package com.example.oppo_play.data

import android.annotation.SuppressLint
import android.content.Context
import android.content.SharedPreferences
import android.os.Build
import android.provider.Settings
import android.util.Log
import com.example.oppo_play.BuildConfig
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

object DeviceRepository {
    private const val TAG = "DeviceRepository"
    private const val PREFS_NAME = "device_prefs"
    private const val KEY_DEVICE_REGISTERED = "device_registered"
    private const val KEY_REGISTERED_USER_ID = "registered_user_id"

    private lateinit var prefs: SharedPreferences
    private lateinit var appContext: Context

    fun init(context: Context) {
        appContext = context.applicationContext
        prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    @SuppressLint("HardwareIds")
    fun getDeviceId(): String {
        return Settings.Secure.getString(appContext.contentResolver, Settings.Secure.ANDROID_ID)
    }

    suspend fun registerDevice(userId: String? = null) {
        if (!::appContext.isInitialized) return

        val deviceId = getDeviceId()
        val request = RegisterDeviceRequest(
            id = deviceId,
            name = Build.MODEL,
            platform = "Android",
            osVersion = Build.VERSION.RELEASE,
            appVersion = BuildConfig.VERSION_NAME,
            pushToken = null,
            isOnline = true,
            userId = userId
        )

        withContext(Dispatchers.IO) {
            try {
                val response = ApiClient.api.registerDevice(request)
                prefs.edit()
                    .putBoolean(KEY_DEVICE_REGISTERED, true)
                    .putString(KEY_REGISTERED_USER_ID, userId)
                    .apply()
                Log.d(TAG, "Device registered: ${response.device.id}, userId: $userId")
            } catch (e: Exception) {
                Log.e(TAG, "Failed to register device", e)
            }
        }
    }

    fun isRegistered(): Boolean {
        if (!::prefs.isInitialized) return false
        return prefs.getBoolean(KEY_DEVICE_REGISTERED, false)
    }

    fun getRegisteredUserId(): String? {
        if (!::prefs.isInitialized) return null
        return prefs.getString(KEY_REGISTERED_USER_ID, null)
    }

    fun needsReregister(newUserId: String?): Boolean {
        val currentUserId = getRegisteredUserId()
        return currentUserId != newUserId
    }
}
