package com.example.oppo_play.data

object UserHistoryRepository {

    suspend fun fetchUserReviews(userId: String): List<UserReviewItem> {
        return try {
            val reviews = ApiClient.api.getUserHistory(userId, "reviews")
            reviews.map { review ->
                review.copy(
                    app = review.app.copy(
                        iconUrl = resolveUrl(review.app.iconUrl)
                    )
                )
            }
        } catch (e: Exception) {
            e.printStackTrace()
            emptyList()
        }
    }

    suspend fun fetchDownloadHistory(userId: String): List<DownloadHistoryItem> {
        return try {
            val downloads = ApiClient.api.getDownloadHistory(userId, "downloads")
            downloads.map { download ->
                download.copy(
                    app = download.app.copy(
                        iconUrl = resolveUrl(download.app.iconUrl)
                    )
                )
            }
        } catch (e: Exception) {
            e.printStackTrace()
            emptyList()
        }
    }

    suspend fun fetchWishlist(userId: String): List<WishlistItem> {
        return try {
            val wishlist = ApiClient.api.getWishlist(userId)
            wishlist.map { item ->
                item.copy(
                    app = item.app.copy(
                        iconUrl = resolveUrl(item.app.iconUrl)
                    )
                )
            }
        } catch (e: Exception) {
            e.printStackTrace()
            emptyList()
        }
    }

    suspend fun removeFromWishlist(userId: String, appId: String): Boolean {
        return try {
            ApiClient.api.removeFromWishlist(WishlistDeleteRequest(userId, appId))
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    suspend fun addToWishlist(userId: String, appId: String): Boolean {
        return try {
            ApiClient.api.addToWishlist(WishlistAddRequest(userId, appId))
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    suspend fun isInWishlist(userId: String, appId: String): Boolean {
        return try {
            val wishlist = ApiClient.api.getWishlist(userId)
            wishlist.any { it.app.id == appId }
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    suspend fun recordDownload(userId: String, appId: String): Boolean {
        return try {
            ApiClient.api.recordDownload(DownloadRequest(userId, appId))
            true
        } catch (e: Exception) {
            e.printStackTrace()
            false
        }
    }

    private fun resolveUrl(url: String): String {
        return if (url.startsWith("http")) url else "${ApiClient.BASE_URL}$url"
    }
}
