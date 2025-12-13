package com.example.oppo_play.model

enum class ContentType { APP, GAME, MOVIE, BOOK }

data class PlayItem(
    val id: String,
    val name: String,
    val category: String,
    val contentType: ContentType,
    val rating: Double,
    val downloads: String,
    val sizeMb: Int,
    val price: String = "Free",
    val developer: String,
    val shortDescription: String,
    val description: String,
    val tags: List<String> = emptyList(),
    val badges: List<String> = emptyList(),
    val screenshots: List<String> = emptyList(),
    val isNew: Boolean = false,
    val isEditorsChoice: Boolean = false,
    val offerText: String? = null
)
