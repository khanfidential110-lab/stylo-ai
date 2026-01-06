package com.styloai.app.ui.screens.profile

import androidx.lifecycle.viewModelScope
import com.styloai.app.data.api.StyloApiService
import com.styloai.app.data.model.*
import com.styloai.app.ui.base.BaseViewModel
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.launch
import javax.inject.Inject

data class ProfileUiState(
    val user: User? = null,
    val subscription: Subscription? = null,
    val showSubscription: Boolean = false,
    val plans: List<SubscriptionPlan> = emptyList()
)

@HiltViewModel
class ProfileViewModel @Inject constructor(
    private val api: StyloApiService
) : BaseViewModel<ProfileUiState>(ProfileUiState()) {

    init {
        loadProfile()
    }

    fun loadProfile() {
        viewModelScope.launch {
            setLoading(true)

            try {
                val userResponse = api.getCurrentUser()
                if (userResponse.isSuccessful) {
                    updateState { it.copy(user = userResponse.body()) }
                }

                val subscriptionResponse = api.getCurrentSubscription()
                if (subscriptionResponse.isSuccessful) {
                    updateState { it.copy(subscription = subscriptionResponse.body()) }
                }

                setLoading(false)
            } catch (e: Exception) {
                setLoading(false)
                showError(e.message ?: "Failed to load profile")
            }
        }
    }

    fun showSubscription() {
        viewModelScope.launch {
            try {
                setLoading(true)
                val plansResponse = api.getSubscriptionPlans()
                if (plansResponse.isSuccessful) {
                    updateState { it.copy(
                        plans = plansResponse.body() ?: emptyList(),
                        showSubscription = true
                    ) }
                }
                setLoading(false)
            } catch (e: Exception) {
                setLoading(false)
                showError(e.message ?: "Failed to load plans")
            }
        }
    }

    fun hideSubscription() {
        updateState { it.copy(showSubscription = false) }
    }

    fun purchasePlan(planId: String, purchaseToken: String) {
        viewModelScope.launch {
            try {
                setLoading(true)
                val plan = uiState.value.plans.find { it.id == planId } ?: return@launch

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
                    showError(response.body()?.message ?: "Purchase verification failed")
                }
                setLoading(false)
            } catch (e: Exception) {
                setLoading(false)
                showError(e.message ?: "Purchase failed")
            }
        }
    }
}
