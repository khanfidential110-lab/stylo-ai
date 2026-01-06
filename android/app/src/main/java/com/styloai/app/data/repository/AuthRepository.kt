package com.styloai.app.data.repository

import android.content.Context
import androidx.datastore.core.DataStore
import androidx.datastore.preferences.core.Preferences
import androidx.datastore.preferences.core.edit
import androidx.datastore.preferences.core.stringPreferencesKey
import androidx.datastore.preferences.preferencesDataStore
import com.styloai.app.data.api.StyloApiService
import com.styloai.app.data.model.*
import dagger.hilt.android.qualifiers.ApplicationContext
import kotlinx.coroutines.flow.Flow
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map
import javax.inject.Inject
import javax.inject.Singleton

private val Context.dataStore: DataStore<Preferences> by preferencesDataStore(name = "auth_prefs")

@Singleton
class AuthRepository @Inject constructor(
    @ApplicationContext private val context: Context,
    private val api: StyloApiService
) {
    private val accessTokenKey = stringPreferencesKey("access_token")
    private val refreshTokenKey = stringPreferencesKey("refresh_token")
    private val userIdKey = stringPreferencesKey("user_id")
    private val onboardingCompletedKey = stringPreferencesKey("onboarding_completed")

    val isOnboardingCompleted: Flow<Boolean> = context.dataStore.data.map { prefs ->
        prefs[onboardingCompletedKey] == "true"
    }

    val isLoggedIn: Flow<Boolean> = context.dataStore.data.map { prefs ->
        prefs[accessTokenKey] != null
    }

    suspend fun getAccessToken(): String? {
        return context.dataStore.data.first()[accessTokenKey]
    }

    suspend fun getRefreshToken(): String? {
        return context.dataStore.data.first()[refreshTokenKey]
    }

    suspend fun login(email: String, password: String): Result<User> {
        return try {
            val response = api.login(LoginRequest(email, password))
            if (response.isSuccessful && response.body() != null) {
                val authResponse = response.body()!!
                saveTokensFromResponse(authResponse)
                // Fetch user profile
                val userResponse = api.getCurrentUser()
                if (userResponse.isSuccessful && userResponse.body() != null) {
                    val user = userResponse.body()!!
                    saveUserId(user.id)
                    Result.success(user)
                } else {
                    // Create placeholder user if fetch fails
                    val placeholderUser = User(id = "temp", email = email, name = null)
                    Result.success(placeholderUser)
                }
            } else {
                Result.failure(Exception(response.errorBody()?.string() ?: "Login failed"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun register(email: String, password: String, name: String?): Result<User> {
        return try {
            val response = api.register(RegisterRequest(email, password, name))
            if (response.isSuccessful && response.body() != null) {
                val authResponse = response.body()!!
                saveTokensFromResponse(authResponse)
                // Fetch user profile
                val userResponse = api.getCurrentUser()
                if (userResponse.isSuccessful && userResponse.body() != null) {
                    val user = userResponse.body()!!
                    saveUserId(user.id)
                    Result.success(user)
                } else {
                    // Create placeholder user if fetch fails
                    val placeholderUser = User(id = "temp", email = email, name = name)
                    Result.success(placeholderUser)
                }
            } else {
                Result.failure(Exception(response.errorBody()?.string() ?: "Registration failed"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun refreshAccessToken(): Result<AuthTokens> {
        return try {
            val refreshToken = getRefreshToken() ?: return Result.failure(Exception("No refresh token"))
            val response = api.refreshToken(mapOf("refresh_token" to refreshToken))
            if (response.isSuccessful && response.body() != null) {
                val tokens = response.body()!!
                saveTokens(tokens)
                Result.success(tokens)
            } else {
                logout()
                Result.failure(Exception("Token refresh failed"))
            }
        } catch (e: Exception) {
            Result.failure(e)
        }
    }

    suspend fun logout() {
        try {
            api.logout()
        } catch (_: Exception) { }
        context.dataStore.edit { prefs ->
            prefs.remove(accessTokenKey)
            prefs.remove(refreshTokenKey)
            prefs.remove(userIdKey)
        }
    }

    private suspend fun saveTokens(tokens: AuthTokens) {
        context.dataStore.edit { prefs ->
            tokens.accessToken?.let { prefs[accessTokenKey] = it }
            tokens.refreshToken?.let { prefs[refreshTokenKey] = it }
        }
    }

    private suspend fun saveTokensFromResponse(authResponse: AuthResponse) {
        context.dataStore.edit { prefs ->
            authResponse.accessToken?.let { prefs[accessTokenKey] = it }
            authResponse.refreshToken?.let { prefs[refreshTokenKey] = it }
        }
    }

    private suspend fun saveUserId(userId: String) {
        context.dataStore.edit { prefs ->
            prefs[userIdKey] = userId
        }
    }

    suspend fun saveOnboardingCompleted() {
        context.dataStore.edit { prefs ->
            prefs[onboardingCompletedKey] = "true"
        }
    }
}
