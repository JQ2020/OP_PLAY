package com.example.oppo_play.ui

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.example.oppo_play.data.ReviewRepository
import com.example.oppo_play.model.Review
import kotlinx.coroutines.launch

sealed interface ReviewsUiState {
    data object Loading : ReviewsUiState
    data class Error(val message: String) : ReviewsUiState
    data class Success(
        val reviews: List<Review>,
        val averageRating: Double,
        val ratingCounts: Map<Int, Int>
    ) : ReviewsUiState
}

sealed interface SubmitState {
    data object Idle : SubmitState
    data object Submitting : SubmitState
    data object Success : SubmitState
    data class Error(val message: String) : SubmitState
}

class ReviewViewModel : ViewModel() {
    var uiState: ReviewsUiState by mutableStateOf(ReviewsUiState.Loading)
        private set

    var submitState: SubmitState by mutableStateOf(SubmitState.Idle)
        private set

    private var currentAppId: String? = null

    fun loadReviews(appId: String) {
        currentAppId = appId
        uiState = ReviewsUiState.Loading
        viewModelScope.launch {
            uiState = try {
                val reviews = ReviewRepository.fetchReviews(appId)
                val avg = if (reviews.isEmpty()) 0.0
                else reviews.map { it.rating }.average()
                val counts = reviews.groupingBy { it.rating }.eachCount()
                ReviewsUiState.Success(reviews, avg, counts)
            } catch (e: Exception) {
                ReviewsUiState.Error(e.message ?: "Failed to load reviews")
            }
        }
    }

    fun submitReview(appId: String, rating: Int, content: String) {
        submitState = SubmitState.Submitting
        viewModelScope.launch {
            submitState = try {
                ReviewRepository.submitReview(appId, rating, content)
                loadReviews(appId)
                SubmitState.Success
            } catch (e: Exception) {
                SubmitState.Error(e.message ?: "Failed to submit review")
            }
        }
    }

    fun deleteReview(reviewId: String) {
        val appId = currentAppId ?: return
        viewModelScope.launch {
            try {
                ReviewRepository.deleteReview(reviewId)
                loadReviews(appId)
            } catch (_: Exception) { }
        }
    }

    fun resetSubmitState() {
        submitState = SubmitState.Idle
    }
}
