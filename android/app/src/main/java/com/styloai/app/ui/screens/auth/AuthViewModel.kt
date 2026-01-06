package com.styloai.app.ui.screens.auth

import androidx.lifecycle.viewModelScope
import com.styloai.app.data.model.User
import com.styloai.app.data.repository.AuthRepository
import com.styloai.app.ui.base.BaseViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.SharingStarted
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.stateIn
import kotlinx.coroutines.launch
import javax.inject.Inject

data class AuthUiState(
    val user: User? = null
)

@HiltViewModel
class AuthViewModel @Inject constructor(
    private val authRepository: AuthRepository
) : BaseViewModel<AuthUiState>(AuthUiState()) {

    val isLoggedIn = authRepository.isLoggedIn.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        null
    )

    val isOnboardingCompleted = authRepository.isOnboardingCompleted.stateIn(
        viewModelScope,
        SharingStarted.WhileSubscribed(5000),
        null
    )

    fun login(email: String, password: String) {
        viewModelScope.launch {
            setLoading(true)
            val result = authRepository.login(email, password)
            result.fold(
                onSuccess = { user ->
                    setLoading(false)
                    updateState { it.copy(user = user) }
                },
                onFailure = { error ->
                    setLoading(false)
                    showError(error.message ?: "Login failed")
                }
            )
        }
    }

    fun register(email: String, password: String, name: String?) {
        viewModelScope.launch {
            setLoading(true)
            val result = authRepository.register(email, password, name)
            result.fold(
                onSuccess = { user ->
                    setLoading(false)
                    updateState { it.copy(user = user) }
                },
                onFailure = { error ->
                    setLoading(false)
                    showError(error.message ?: "Registration failed")
                }
            )
        }
    }

    fun logout() {
        viewModelScope.launch {
            authRepository.logout()
        }
    }

    fun completeOnboarding() {
        viewModelScope.launch {
            authRepository.saveOnboardingCompleted()
        }
    }
}
