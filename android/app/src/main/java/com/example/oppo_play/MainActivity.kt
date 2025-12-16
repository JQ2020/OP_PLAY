package com.example.oppo_play

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.runtime.CompositionLocalProvider
import androidx.lifecycle.lifecycleScope
import coil.compose.LocalImageLoader
import com.example.oppo_play.data.AppRepository
import com.example.oppo_play.data.DeviceRepository
import com.example.oppo_play.data.UserRepository
import com.example.oppo_play.ui.theme.Oppo_playTheme
import com.example.oppo_play.ui.PlayAppNavHost
import com.example.oppo_play.ui.rememberOppoImageLoader
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        AppRepository.init(applicationContext)
        UserRepository.init(applicationContext)
        DeviceRepository.init(applicationContext)

        lifecycleScope.launch {
            DeviceRepository.registerDevice()
        }

        enableEdgeToEdge()
        setContent {
            Oppo_playTheme {
                CompositionLocalProvider(
                    LocalImageLoader provides rememberOppoImageLoader()
                ) {
                    PlayAppNavHost()
                }
            }
        }
    }
}
