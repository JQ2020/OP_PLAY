package com.example.oppo_play.model

data class Review(
    val id: String,
    val userName: String,
    val userImage: String?,
    val rating: Int,
    val content: String,
    val createdAt: Long,
    val appId: String,
    val isOwn: Boolean = false
)
