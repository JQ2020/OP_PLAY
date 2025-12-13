package com.example.oppo_play.model

data class User(
    val id: String,
    val name: String,
    val email: String,
    val avatar: String? = null,
    val createdAt: Long = 0L
)
