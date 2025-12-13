package com.example.oppo_play.data

import com.squareup.moshi.Json
import com.squareup.moshi.Moshi
import com.squareup.moshi.kotlin.reflect.KotlinJsonAdapterFactory
import com.example.oppo_play.BuildConfig
import okhttp3.OkHttpClient
import okhttp3.logging.HttpLoggingInterceptor
import retrofit2.Retrofit
import retrofit2.converter.moshi.MoshiConverterFactory
import retrofit2.http.*

object ApiClient {
    const val BASE_URL = "http://192.168.0.101:3000/"

    private val moshi: Moshi = Moshi.Builder()
        .add(KotlinJsonAdapterFactory())
        .build()

    private val logging = HttpLoggingInterceptor().apply {
        level = if (BuildConfig.DEBUG) {
            HttpLoggingInterceptor.Level.BODY
        } else {
            HttpLoggingInterceptor.Level.BASIC
        }
    }

    private val okHttpClient = OkHttpClient.Builder()
        .addInterceptor(logging)
        .build()

    val api: PlayStoreApi by lazy {
        Retrofit.Builder()
            .baseUrl(BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(MoshiConverterFactory.create(moshi))
            .build()
            .create(PlayStoreApi::class.java)
    }
}

// ============== App Models ==============

data class ApiApp(
    val id: String,
    val title: String,
    val developer: String,
    val iconUrl: String,
    val description: String? = null,
    val rating: Double,
    val downloads: String,
    val category: String,
    val isInstalled: Boolean = false,
    val size: String? = null,
    val version: String? = null,
    val updatedAt: String? = null
)

data class AppsPageResponse(
    val items: List<ApiApp>,
    val nextCursor: String?,
    val hasMore: Boolean
)

// ============== Review Models ==============

data class ApiReview(
    val id: String,
    val userName: String,
    val userImage: String?,
    val rating: Int,
    val content: String,
    val createdAt: String,
    val appId: String
)

data class CreateReviewRequest(
    val appId: String,
    val userName: String,
    val userImage: String?,
    val rating: Int,
    val content: String,
    val userId: String? = null
)

data class UpdateReviewRequest(
    val rating: Int?,
    val content: String?
)

// ============== Device Models ==============

data class ApiDevice(
    val id: String,
    val name: String,
    val platform: String,
    val osVersion: String?,
    val appVersion: String?,
    val pushToken: String?,
    val isOnline: Boolean,
    val lastSeen: String?,
    val createdAt: String?
)

data class DeviceResponse(val device: ApiDevice)

data class RegisterDeviceRequest(
    val id: String,
    val name: String,
    val platform: String,
    val osVersion: String?,
    val appVersion: String?,
    val pushToken: String?,
    val isOnline: Boolean,
    val userId: String?
)

// ============== Install Task Models ==============

data class ApiInstallTask(
    val id: String,
    val status: String,
    val progress: Int,
    val message: String?,
    val downloadUrl: String?,
    val simulateDuration: Int?,
    val fileSize: String?,
    val downloadSpeed: String?,
    val createdAt: String,
    val updatedAt: String,
    val device: TaskDevice?,
    val app: TaskApp?
)

data class TaskDevice(
    val id: String,
    val name: String,
    val platform: String,
    val isOnline: Boolean
)

data class TaskApp(
    val id: String,
    val title: String,
    val iconUrl: String,
    val category: String?
)

data class InstallTasksResponse(val tasks: List<ApiInstallTask>)
data class InstallTaskResponse(val task: ApiInstallTask)

data class UpdateTaskStatusRequest(
    val status: String,
    val progress: Int?,
    val message: String?
)

data class CreateInstallTaskRequest(
    val appId: String,
    val deviceId: String
)

// ============== User Models ==============

data class ApiUser(
    val id: String,
    val name: String,
    val email: String,
    val avatar: String?,
    val createdAt: String
)

data class UserAuthRequest(
    val action: String,
    val name: String? = null,
    val email: String,
    val password: String
)

data class UserUpdateRequest(
    val name: String? = null,
    val email: String? = null,
    val avatar: String? = null
)

// ============== User History Models ==============

data class AppSummary(
    val id: String,
    val title: String,
    val iconUrl: String,
    val developer: String? = null,
    val rating: Double? = null
)

data class UserReviewItem(
    val id: String,
    val rating: Int,
    val content: String,
    val createdAt: String,
    val app: AppSummary
)

data class DownloadHistoryItem(
    val id: String,
    val createdAt: String,
    val app: AppSummary
)

data class WishlistItem(
    val id: String,
    val createdAt: String,
    val app: AppSummary
)

// ============== API Interface ==============

interface PlayStoreApi {
    // Apps - Public paginated endpoint
    @GET("api/apps")
    suspend fun getApps(
        @Query("cursor") cursor: String? = null,
        @Query("limit") limit: Int = 20,
        @Query("category") category: String? = null
    ): AppsPageResponse

    // Apps - Admin endpoint for detail (includes description)
    @GET("api/admin/apps/{id}")
    suspend fun getApp(@Path("id") id: String): ApiApp

    // Reviews
    @GET("api/reviews")
    suspend fun getReviews(@Query("appId") appId: String): List<ApiReview>

    @POST("api/reviews")
    suspend fun createReview(@Body request: CreateReviewRequest): ApiReview

    @PATCH("api/reviews/{id}")
    suspend fun updateReview(
        @Path("id") id: String,
        @Body request: UpdateReviewRequest
    ): ApiReview

    @DELETE("api/reviews/{id}")
    suspend fun deleteReview(@Path("id") id: String)

    // Device registration
    @POST("api/devices")
    suspend fun registerDevice(@Body request: RegisterDeviceRequest): DeviceResponse

    // Install tasks
    @GET("api/install-requests")
    suspend fun getInstallTasks(
        @Query("deviceId") deviceId: String,
        @Query("status") status: String? = null,
        @Query("limit") limit: Int = 20
    ): InstallTasksResponse

    @GET("api/install-requests/{id}")
    suspend fun getInstallTask(@Path("id") id: String): InstallTaskResponse

    @PATCH("api/install-requests/{id}")
    suspend fun updateInstallTask(
        @Path("id") id: String,
        @Body request: UpdateTaskStatusRequest
    ): InstallTaskResponse

    @POST("api/install-requests")
    suspend fun createInstallTask(@Body request: CreateInstallTaskRequest): InstallTaskResponse

    // User authentication
    @POST("api/user")
    suspend fun authUser(@Body request: UserAuthRequest): ApiUser

    @GET("api/user/{id}")
    suspend fun getUser(@Path("id") id: String): ApiUser

    @PATCH("api/user/{id}")
    suspend fun updateUser(
        @Path("id") id: String,
        @Body request: UserUpdateRequest
    ): ApiUser

    // User history
    @GET("api/user/{id}/history")
    suspend fun getUserHistory(
        @Path("id") id: String,
        @Query("type") type: String
    ): List<UserReviewItem>

    @GET("api/user/{id}/history")
    suspend fun getDownloadHistory(
        @Path("id") id: String,
        @Query("type") type: String
    ): List<DownloadHistoryItem>

    // Wishlist
    @GET("api/wishlist")
    suspend fun getWishlist(@Query("userId") userId: String): List<WishlistItem>

    @HTTP(method = "DELETE", path = "api/wishlist", hasBody = true)
    suspend fun removeFromWishlist(@Body request: WishlistDeleteRequest)

    @POST("api/wishlist")
    suspend fun addToWishlist(@Body request: WishlistAddRequest): WishlistItem

    // Download history
    @POST("api/downloads")
    suspend fun recordDownload(@Body request: DownloadRequest): DownloadHistoryItem
}

data class WishlistDeleteRequest(
    val userId: String,
    val appId: String
)

data class DownloadRequest(
    val userId: String,
    val appId: String
)

data class WishlistAddRequest(
    val userId: String,
    val appId: String
)
