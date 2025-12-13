package com.example.oppo_play.data

import android.content.Context
import android.content.SharedPreferences
import android.util.Log
import com.example.oppo_play.model.User
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext

sealed class AuthResult {
    data class Success(val user: User) : AuthResult()
    data class Error(val message: String) : AuthResult()
}

object UserRepository {
    private const val TAG = "UserRepository"
    private const val PREFS_NAME = "user_prefs"
    private const val KEY_USER_ID = "user_id"

    private lateinit var prefs: SharedPreferences
    private var cachedUser: User? = null

    fun init(context: Context) {
        prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
    }

    suspend fun login(email: String, password: String): AuthResult = withContext(Dispatchers.IO) {
        try {
            val request = UserAuthRequest(
                action = "login",
                email = email,
                password = password
            )
            val apiUser = ApiClient.api.authUser(request)
            val user = apiUser.toDomain()
            saveUserId(user.id)
            cachedUser = user
            Log.d(TAG, "Login successful: ${user.name}")
            AuthResult.Success(user)
        } catch (e: retrofit2.HttpException) {
            val errorMsg = when (e.code()) {
                401 -> "Invalid email or password"
                else -> "Login failed"
            }
            Log.e(TAG, "Login failed: ${e.code()}", e)
            AuthResult.Error(errorMsg)
        } catch (e: Exception) {
            Log.e(TAG, "Login error", e)
            AuthResult.Error(e.message ?: "Network error")
        }
    }

    suspend fun register(name: String, email: String, password: String): AuthResult = withContext(Dispatchers.IO) {
        try {
            val request = UserAuthRequest(
                action = "register",
                name = name,
                email = email,
                password = password
            )
            val apiUser = ApiClient.api.authUser(request)
            val user = apiUser.toDomain()
            saveUserId(user.id)
            cachedUser = user
            Log.d(TAG, "Registration successful: ${user.name}")
            AuthResult.Success(user)
        } catch (e: retrofit2.HttpException) {
            val errorMsg = when (e.code()) {
                409 -> "Email already registered"
                else -> "Registration failed"
            }
            Log.e(TAG, "Registration failed: ${e.code()}", e)
            AuthResult.Error(errorMsg)
        } catch (e: Exception) {
            Log.e(TAG, "Registration error", e)
            AuthResult.Error(e.message ?: "Network error")
        }
    }

    suspend fun loadUser(): User? = withContext(Dispatchers.IO) {
        if (cachedUser != null) return@withContext cachedUser

        val userId = getSavedUserId() ?: return@withContext null
        try {
            val apiUser = ApiClient.api.getUser(userId)
            cachedUser = apiUser.toDomain()
            cachedUser
        } catch (e: retrofit2.HttpException) {
            Log.e(TAG, "Failed to load user: HTTP ${e.code()}", e)
            // Only clear userId if user not found (404)
            if (e.code() == 404) {
                clearUserId()
            }
            null
        } catch (e: Exception) {
            // Network error - don't clear userId, user may reconnect later
            Log.e(TAG, "Failed to load user (network error)", e)
            null
        }
    }

    suspend fun updateUser(name: String? = null, email: String? = null, avatar: String? = null): User? = withContext(Dispatchers.IO) {
        val userId = cachedUser?.id ?: return@withContext null
        try {
            val request = UserUpdateRequest(name, email, avatar)
            val apiUser = ApiClient.api.updateUser(userId, request)
            cachedUser = apiUser.toDomain()
            cachedUser
        } catch (e: Exception) {
            Log.e(TAG, "Failed to update user", e)
            null
        }
    }

    fun logout() {
        cachedUser = null
        clearUserId()
    }

    fun getUser(): User? = cachedUser

    fun hasUser(): Boolean = cachedUser != null || getSavedUserId() != null

    private fun saveUserId(id: String) {
        prefs.edit().putString(KEY_USER_ID, id).apply()
    }

    private fun getSavedUserId(): String? {
        if (!::prefs.isInitialized) return null
        return prefs.getString(KEY_USER_ID, null)
    }

    private fun clearUserId() {
        if (!::prefs.isInitialized) return
        prefs.edit().remove(KEY_USER_ID).apply()
    }

    private fun ApiUser.toDomain(): User {
        return User(
            id = id,
            name = name,
            email = email,
            avatar = avatar?.let { url ->
                if (url.startsWith("http")) url
                else ApiClient.BASE_URL.trimEnd('/') + url
            },
            createdAt = AppRepository.parseIsoMillis(createdAt)
        )
    }
}
