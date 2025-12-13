package com.example.oppo_play.ui

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.oppo_play.data.AuthResult
import com.example.oppo_play.data.DeviceRepository
import com.example.oppo_play.data.UserRepository
import com.example.oppo_play.model.User
import kotlinx.coroutines.launch

sealed interface AuthState {
    data object Idle : AuthState
    data object Loading : AuthState
    data object Success : AuthState
    data class Error(val message: String) : AuthState
}

class UserViewModel : ViewModel() {
    var user: User? by mutableStateOf(null)
        private set

    var isLoading by mutableStateOf(true)
        private set

    var authState: AuthState by mutableStateOf(AuthState.Idle)
        private set

    var showAuthDialog by mutableStateOf(false)
        private set

    var isRegistering by mutableStateOf(false)
        private set

    init {
        loadUser()
    }

    private fun loadUser() {
        viewModelScope.launch {
            isLoading = true
            user = UserRepository.loadUser()
            // Re-register device if user changed
            if (DeviceRepository.needsReregister(user?.id)) {
                DeviceRepository.registerDevice(user?.id)
            }
            isLoading = false
        }
    }

    fun login(email: String, password: String) {
        authState = AuthState.Loading
        viewModelScope.launch {
            when (val result = UserRepository.login(email, password)) {
                is AuthResult.Success -> {
                    user = result.user
                    // Re-register device with new user
                    DeviceRepository.registerDevice(result.user.id)
                    authState = AuthState.Success
                    showAuthDialog = false
                }
                is AuthResult.Error -> {
                    authState = AuthState.Error(result.message)
                }
            }
        }
    }

    fun register(name: String, email: String, password: String) {
        authState = AuthState.Loading
        viewModelScope.launch {
            when (val result = UserRepository.register(name, email, password)) {
                is AuthResult.Success -> {
                    user = result.user
                    // Re-register device with new user
                    DeviceRepository.registerDevice(result.user.id)
                    authState = AuthState.Success
                    showAuthDialog = false
                }
                is AuthResult.Error -> {
                    authState = AuthState.Error(result.message)
                }
            }
        }
    }

    fun updateProfile(name: String? = null, email: String? = null) {
        viewModelScope.launch {
            val updated = UserRepository.updateUser(name, email)
            if (updated != null) {
                user = updated
            }
        }
    }

    fun logout() {
        // Clear user state immediately for UI update
        UserRepository.logout()
        user = null
        // Re-register device without user in background
        viewModelScope.launch {
            DeviceRepository.registerDevice(null)
        }
    }

    fun showLogin() {
        isRegistering = false
        authState = AuthState.Idle
        showAuthDialog = true
    }

    fun showRegister() {
        isRegistering = true
        authState = AuthState.Idle
        showAuthDialog = true
    }

    fun switchAuthMode() {
        isRegistering = !isRegistering
        authState = AuthState.Idle
    }

    fun dismissAuthDialog() {
        showAuthDialog = false
        authState = AuthState.Idle
    }

    fun requireUser(onMissing: () -> Unit = { showLogin() }): Boolean {
        return if (user == null) {
            onMissing()
            false
        } else {
            true
        }
    }

    fun resetAuthState() {
        authState = AuthState.Idle
    }
}
