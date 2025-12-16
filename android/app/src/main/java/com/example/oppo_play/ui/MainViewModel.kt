package com.example.oppo_play.ui

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.oppo_play.data.AppRepository
import com.example.oppo_play.model.StoreApp
import kotlinx.coroutines.launch

sealed interface AppsUiState {
    data object Loading : AppsUiState
    data class Error(val message: String) : AppsUiState
    data class Success(val apps: List<StoreApp>, val isFromCache: Boolean = false) : AppsUiState
}

class MainViewModel : ViewModel() {
    var uiState: AppsUiState by mutableStateOf(AppsUiState.Loading)
        private set

    init {
        loadApps()
    }

    fun loadApps() {
        val cached = AppRepository.getCachedApps()
        if (cached != null && cached.isNotEmpty()) {
            uiState = AppsUiState.Success(cached, isFromCache = true)
        } else {
            uiState = AppsUiState.Loading
        }

        viewModelScope.launch {
            try {
                val apps = AppRepository.fetchAllApps()
                uiState = AppsUiState.Success(apps, isFromCache = false)
            } catch (e: Exception) {
                if (uiState !is AppsUiState.Success) {
                    uiState = AppsUiState.Error(e.message ?: "Failed to load apps")
                }
            }
        }
    }

    fun markInstalled(appId: String, installed: Boolean = true) {
        val current = uiState
        if (current is AppsUiState.Success) {
            uiState = current.copy(
                apps = current.apps.map { app ->
                    if (app.id == appId) app.copy(isInstalled = installed) else app
                }
            )
        }
    }

    fun appById(appId: String): StoreApp? {
        val current = uiState
        return if (current is AppsUiState.Success) {
            current.apps.find { it.id == appId }
        } else null
    }
}

