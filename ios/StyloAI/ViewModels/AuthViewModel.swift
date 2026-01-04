import SwiftUI

@MainActor
class AuthViewModel: ObservableObject {
    @Published var email = ""
    @Published var password = ""
    @Published var name = ""
    @Published var isLoading = false
    @Published var errorMessage: String?
    @Published var showError = false

    func login() async -> Bool {
        guard validateLoginInput() else { return false }

        isLoading = true
        errorMessage = nil

        do {
            let tokens = try await APIService.shared.login(email: email, password: password)
            KeychainHelper.shared.saveTokens(tokens)
            isLoading = false
            return true
        } catch {
            isLoading = false
            handleError(error)
            return false
        }
    }

    func register() async -> Bool {
        guard validateRegisterInput() else { return false }

        isLoading = true
        errorMessage = nil

        do {
            let tokens = try await APIService.shared.register(
                email: email,
                password: password,
                name: name.isEmpty ? nil : name
            )
            KeychainHelper.shared.saveTokens(tokens)
            isLoading = false
            return true
        } catch {
            isLoading = false
            handleError(error)
            return false
        }
    }

    func signInWithGoogle() async -> Bool {
        // Implement Google Sign-In
        // Use GoogleSignIn SDK
        return false
    }

    func signInWithApple() async -> Bool {
        // Implement Apple Sign-In
        // Use AuthenticationServices
        return false
    }

    private func validateLoginInput() -> Bool {
        if email.isEmpty {
            errorMessage = "Please enter your email"
            showError = true
            return false
        }
        if !email.contains("@") {
            errorMessage = "Please enter a valid email"
            showError = true
            return false
        }
        if password.isEmpty {
            errorMessage = "Please enter your password"
            showError = true
            return false
        }
        return true
    }

    private func validateRegisterInput() -> Bool {
        if !validateLoginInput() { return false }

        if password.count < 8 {
            errorMessage = "Password must be at least 8 characters"
            showError = true
            return false
        }
        return true
    }

    private func handleError(_ error: Error) {
        if let apiError = error as? APIError {
            switch apiError {
            case .serverError(let message):
                errorMessage = message
            case .unauthorized:
                errorMessage = "Invalid credentials"
            default:
                errorMessage = "Something went wrong. Please try again."
            }
        } else {
            errorMessage = error.localizedDescription
        }
        showError = true
    }

    func clearFields() {
        email = ""
        password = ""
        name = ""
        errorMessage = nil
    }
}
