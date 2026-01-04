import SwiftUI

@main
struct StyloAIApp: App {
    @StateObject private var appState = AppState()
    @StateObject private var authViewModel = AuthViewModel()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .environmentObject(authViewModel)
        }
    }
}

class AppState: ObservableObject {
    @Published var isLoggedIn: Bool = false
    @Published var user: User?
    @Published var subscriptionTier: SubscriptionTier = .free

    init() {
        checkAuthStatus()
    }

    func checkAuthStatus() {
        if let token = KeychainHelper.shared.getAccessToken() {
            isLoggedIn = true
            Task {
                await loadUserProfile()
            }
        }
    }

    @MainActor
    func loadUserProfile() async {
        do {
            let user = try await APIService.shared.getCurrentUser()
            self.user = user
            self.subscriptionTier = user.subscriptionTier
        } catch {
            print("Failed to load user: \(error)")
        }
    }

    func logout() {
        KeychainHelper.shared.clearTokens()
        isLoggedIn = false
        user = nil
        subscriptionTier = .free
    }
}
