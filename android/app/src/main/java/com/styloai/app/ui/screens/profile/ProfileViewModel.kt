package com.styloai.app.ui.screens.profile

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.styloai.app.data.api.StyloApiService
import com.styloai.app.data.model.*
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ProfileUiState(
    val isLoading: Boolean = true,
    val user: User? = null,
    val subscription: Subscription? = null,
    val showSubscription: Boolean = false,
    val plans: List<SubscriptionPlan> = emptyList(),
    val error: String? = null
)

@HiltViewModel
class ProfileViewModel @Inject constructor(
    private val api: StyloApiService
) : ViewModel() {

    private val _uiState = MutableStateFlow(ProfileUiState())
    val uiState: StateFlow<ProfileUiState> = _uiState

    init {
        loadProfile()
    }

    fun loadProfile() {
        viewModelScope.launch {
            _uiState.value = _uiState.value.copy(isLoading = true)

            try {
                val userResponse = api.getCurrentUser()
                if (userResponse.isSuccessful) {
                    _uiState.value = _uiState.value.copy(user = userResponse.body())
                }

                val subscriptionResponse = api.getCurrentSubscription()
                if (subscriptionResponse.isSuccessful) {
                    _uiState.value = _uiState.value.copy(subscription = subscriptionResponse.body())
                }

                _uiState.value = _uiState.value.copy(isLoading = false)
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(
                    isLoading = false,
                    error = e.message
                )
            }
        }
    }

    fun showSubscription() {
        viewModelScope.launch {
            // Load plans
            try {
                val plansResponse = api.getSubscriptionPlans()
                if (plansResponse.isSuccessful) {
                    _uiState.value = _uiState.value.copy(
                        plans = plansResponse.body() ?: emptyList(),
                        showSubscription = true
                    )
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(error = e.message)
            }
        }
    }

    fun hideSubscription() {
        _uiState.value = _uiState.value.copy(showSubscription = false)
    }

    fun purchasePlan(planId: String, purchaseToken: String) {
        viewModelScope.launch {
            try {
                val plan = _uiState.value.plans.find { it.id == planId } ?: return@launch

                val response = api.verifyGooglePurchase(
                    VerifyPurchaseRequest(
                        purchaseToken = purchaseToken,
                        productId = plan.googleProductId
                    )
                )

                if (response.isSuccessful && response.body()?.success == true) {
                    loadProfile()
                    hideSubscription()
                } else {
                    _uiState.value = _uiState.value.copy(
                        error = response.body()?.message ?: "Purchase verification failed"
                    )
                }
            } catch (e: Exception) {
                _uiState.value = _uiState.value.copy(error = e.message)
            }
        }
    }

    fun clearError() {
        _uiState.value = _uiState.value.copy(error = null)
    }
}
