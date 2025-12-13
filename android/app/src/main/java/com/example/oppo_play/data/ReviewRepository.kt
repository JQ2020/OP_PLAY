package com.example.oppo_play.data

import com.example.oppo_play.model.Review

object ReviewRepository {
    suspend fun fetchReviews(appId: String): List<Review> {
        val apiReviews = ApiClient.api.getReviews(appId)
        val currentUser = UserRepository.getUser()
        return apiReviews.map { it.toDomain(currentUser?.name) }
    }

    suspend fun submitReview(appId: String, rating: Int, content: String): Review {
        val user = UserRepository.getUser()
            ?: throw IllegalStateException("User not logged in")
        val request = CreateReviewRequest(
            appId = appId,
            userName = user.name,
            userImage = user.avatar,
            rating = rating,
            content = content,
            userId = user.id
        )
        return ApiClient.api.createReview(request).toDomain(user.name)
    }

    suspend fun updateReview(reviewId: String, rating: Int?, content: String?): Review {
        val user = UserRepository.getUser()
        return ApiClient.api.updateReview(reviewId, UpdateReviewRequest(rating, content))
            .toDomain(user?.name)
    }

    suspend fun deleteReview(reviewId: String) {
        ApiClient.api.deleteReview(reviewId)
    }

    private fun ApiReview.toDomain(currentUserName: String?): Review {
        return Review(
            id = id,
            userName = userName,
            userImage = userImage,
            rating = rating,
            content = content,
            createdAt = AppRepository.parseIsoMillis(createdAt),
            appId = appId,
            isOwn = userName == currentUserName
        )
    }
}
