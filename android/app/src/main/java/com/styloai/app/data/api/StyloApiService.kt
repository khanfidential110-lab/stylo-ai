package com.styloai.app.data.api

import com.styloai.app.data.model.*
import retrofit2.Response
import retrofit2.http.*
import okhttp3.MultipartBody
import okhttp3.RequestBody

interface StyloApiService {

    // Auth
    @POST("auth/login")
    suspend fun login(@Body request: LoginRequest): Response<AuthResponse>

    @POST("auth/register")
    suspend fun register(@Body request: RegisterRequest): Response<AuthResponse>

    @POST("auth/refresh")
    suspend fun refreshToken(@Body body: Map<String, String>): Response<AuthTokens>

    @POST("auth/logout")
    suspend fun logout(): Response<Unit>

    // User
    @GET("users/me")
    suspend fun getCurrentUser(): Response<User>

    @PATCH("users/me")
    suspend fun updateUser(@Body updates: Map<String, Any>): Response<User>

    @GET("users/me/style-profile")
    suspend fun getStyleProfile(): Response<StyleProfile>

    @PUT("users/me/style-profile")
    suspend fun updateStyleProfile(@Body profile: StyleProfile): Response<StyleProfile>

    // Wardrobe
    @GET("wardrobe")
    suspend fun getWardrobeItems(
        @Query("category") category: String? = null,
        @Query("season") season: String? = null,
        @Query("occasion") occasion: String? = null
    ): Response<PaginatedWardrobeResponse>

    @GET("wardrobe/{id}")
    suspend fun getWardrobeItem(@Path("id") id: String): Response<WardrobeItem>

    @POST("wardrobe")
    suspend fun createWardrobeItem(@Body item: CreateWardrobeItemRequest): Response<WardrobeItem>

    @Multipart
    @POST("wardrobe")
    suspend fun uploadWardrobeItem(
        @Part image: MultipartBody.Part,
        @Part("category") category: RequestBody,
        @Part("name") name: RequestBody? = null,
        @Part("primary_color") primaryColor: RequestBody? = null,
        @Part("brand") brand: RequestBody? = null,
        @Part("size") size: RequestBody? = null,
        @Part("material") material: RequestBody? = null,
        @Part("pattern") pattern: RequestBody? = null,
        @Part("seasons") seasons: RequestBody? = null,
        @Part("occasions") occasions: RequestBody? = null
    ): Response<WardrobeItem>

    @PATCH("wardrobe/{id}")
    suspend fun updateWardrobeItem(
        @Path("id") id: String,
        @Body updates: Map<String, Any>
    ): Response<WardrobeItem>

    @DELETE("wardrobe/{id}")
    suspend fun deleteWardrobeItem(@Path("id") id: String): Response<Unit>

    @GET("wardrobe/stats")
    suspend fun getWardrobeStats(): Response<WardrobeStats>

    @POST("wardrobe/analyze")
    suspend fun analyzeClothing(@Body body: Map<String, String>): Response<Map<String, Any>>
    
    @Multipart
    @POST("wardrobe/analyze/upload")
    suspend fun analyzeClothingFromImage(
        @Part image: MultipartBody.Part
    ): Response<Map<String, Any>>

    @POST("wardrobe/detect-outfit")
    suspend fun detectOutfitItems(@Body body: Map<String, String>): Response<OutfitDetectionResult>
    
    @Multipart
    @POST("wardrobe/detect/upload")
    suspend fun detectOutfitFromImage(
        @Part image: MultipartBody.Part,
        @Part("autoSave") autoSave: RequestBody? = null
    ): Response<OutfitDetectionResult>

    // Outfits
    @GET("outfits")
    suspend fun getOutfits(): Response<PaginatedOutfitResponse>

    @GET("outfits/{id}")
    suspend fun getOutfit(@Path("id") id: String): Response<Outfit>

    @POST("outfits")
    suspend fun createOutfit(@Body request: CreateOutfitRequest): Response<Outfit>

    @DELETE("outfits/{id}")
    suspend fun deleteOutfit(@Path("id") id: String): Response<Unit>

    @POST("outfits/{id}/wear")
    suspend fun markOutfitWorn(@Path("id") id: String): Response<Outfit>

    @POST("outfits/{id}/favorite")
    suspend fun toggleOutfitFavorite(@Path("id") id: String): Response<Outfit>

    @POST("outfits/analyze")
    suspend fun analyzeOutfit(@Body body: Map<String, List<String>>): Response<Outfit>

    @GET("outfits/recommendations")
    suspend fun getOutfitRecommendations(
        @Query("occasion") occasion: String? = null,
        @Query("include_weather") includeWeather: Boolean = true
    ): Response<List<OutfitRecommendation>>

    // Outfit Calendar
    @GET("outfits/calendar")
    suspend fun getCalendarEntries(
        @Query("start_date") startDate: String,
        @Query("end_date") endDate: String
    ): Response<List<OutfitCalendarEntry>>

    @POST("outfits/calendar")
    suspend fun createCalendarEntry(@Body body: Map<String, String>): Response<OutfitCalendarEntry>

    // Weather
    @GET("weather")
    suspend fun getCurrentWeather(
        @Query("lat") lat: Double? = null,
        @Query("lon") lon: Double? = null,
        @Query("city") city: String? = null
    ): Response<WeatherResponse>

    @GET("weather/forecast")
    suspend fun getWeatherForecast(
        @Query("lat") lat: Double? = null,
        @Query("lon") lon: Double? = null,
        @Query("city") city: String? = null
    ): Response<WeatherForecast>

    // Chat
    @GET("chat/conversations")
    suspend fun getConversations(): Response<List<Conversation>>

    @GET("chat/conversations/{id}/messages")
    suspend fun getConversationMessages(@Path("id") id: String): Response<List<ChatMessage>>

    @POST("chat/message")
    suspend fun sendChatMessage(@Body request: ChatRequest): Response<ChatResponse>

    @DELETE("chat/conversations/{id}")
    suspend fun deleteConversation(@Path("id") id: String): Response<Unit>

    // Subscription
    @GET("subscription/plans")
    suspend fun getSubscriptionPlans(): Response<List<SubscriptionPlan>>

    @GET("subscription/current")
    suspend fun getCurrentSubscription(): Response<Subscription?>

    @POST("subscription/google/verify")
    suspend fun verifyGooglePurchase(@Body request: VerifyPurchaseRequest): Response<VerifyPurchaseResponse>
}
