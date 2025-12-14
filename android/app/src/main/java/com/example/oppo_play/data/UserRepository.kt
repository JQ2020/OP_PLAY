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
    private const val KEY_USER_NAME = "user_name"
    private const val KEY_USER_EMAIL = "user_email"
    private const val KEY_USER_AVATAR = "user_avatar"

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
            saveUser(user)
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
            saveUser(user)
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

        val savedUser = getSavedUser() ?: return@withContext null
        try {
            val apiUser = ApiClient.api.getUser(savedUser.id)
            cachedUser = apiUser.toDomain()
            saveUser(cachedUser!!)
            cachedUser
        } catch (e: retrofit2.HttpException) {
            Log.e(TAG, "Failed to load user: HTTP ${e.code()}", e)
            if (e.code() == 404) {
                clearUser()
                null
            } else {
                cachedUser = savedUser
                savedUser
            }
        } catch (e: Exception) {
            Log.e(TAG, "Failed to load user (network error), using cached", e)
            cachedUser = savedUser
            savedUser
        }
    }

    suspend fun updateUser(name: String? = null, email: String? = null, avatar: String? = null): User? = withContext(Dispatchers.IO) {
        val userId = cachedUser?.id ?: return@withContext null
        try {
            val request = UserUpdateRequest(name, email, avatar)
            val apiUser = ApiClient.api.updateUser(userId, request)
            cachedUser = apiUser.toDomain()
            saveUser(cachedUser!!)
            cachedUser
        } catch (e: Exception) {
            Log.e(TAG, "Failed to update user", e)
            null
        }
    }

    fun logout() {
        cachedUser = null
        clearUser()
    }

    fun getUser(): User? = cachedUser

    fun hasUser(): Boolean = cachedUser != null || getSavedUser() != null

    private fun saveUser(user: User) {
        if (!::prefs.isInitialized) return
        prefs.edit()
            .putString(KEY_USER_ID, user.id)
            .putString(KEY_USER_NAME, user.name)
            .putString(KEY_USER_EMAIL, user.email)
            .putString(KEY_USER_AVATAR, user.avatar)
            .apply()
    }

    private fun getSavedUser(): User? {
        if (!::prefs.isInitialized) return null
        val id = prefs.getString(KEY_USER_ID, null) ?: return null
        val name = prefs.getString(KEY_USER_NAME, null) ?: return null
        val email = prefs.getString(KEY_USER_EMAIL, null) ?: return null
        val avatar = prefs.getString(KEY_USER_AVATAR, null)
        return User(id, name, email, avatar, 0L)
    }

    private fun clearUser() {
        if (!::prefs.isInitialized) return
        prefs.edit()
            .remove(KEY_USER_ID)
            .remove(KEY_USER_NAME)
            .remove(KEY_USER_EMAIL)
            .remove(KEY_USER_AVATAR)
            .apply()
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
