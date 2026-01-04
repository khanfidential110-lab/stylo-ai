import SwiftUI
import AuthenticationServices

struct AuthView: View {
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var authViewModel: AuthViewModel
    @State private var isLogin = true

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Logo and Title
                    VStack(spacing: 8) {
                        Image(systemName: "tshirt.fill")
                            .font(.system(size: 60))
                            .foregroundColor(.brandIndigo)

                        Text("STYLO AI")
                            .font(.system(size: 32, weight: .bold))
                            .foregroundColor(.primary)

                        Text("Your Personal AI Stylist")
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                    .padding(.top, 40)

                    // Toggle between Login and Register
                    Picker("", selection: $isLogin) {
                        Text("Login").tag(true)
                        Text("Sign Up").tag(false)
                    }
                    .pickerStyle(.segmented)
                    .padding(.horizontal)

                    // Form Fields
                    VStack(spacing: 16) {
                        if !isLogin {
                            TextField("Name (optional)", text: $authViewModel.name)
                                .textFieldStyle(StyloTextFieldStyle())
                                .textContentType(.name)
                        }

                        TextField("Email", text: $authViewModel.email)
                            .textFieldStyle(StyloTextFieldStyle())
                            .textContentType(.emailAddress)
                            .keyboardType(.emailAddress)
                            .autocapitalization(.none)

                        SecureField("Password", text: $authViewModel.password)
                            .textFieldStyle(StyloTextFieldStyle())
                            .textContentType(isLogin ? .password : .newPassword)
                    }
                    .padding(.horizontal)

                    // Main Action Button
                    Button {
                        Task {
                            let success = isLogin
                                ? await authViewModel.login()
                                : await authViewModel.register()
                            if success {
                                appState.isLoggedIn = true
                                await appState.loadUserProfile()
                            }
                        }
                    } label: {
                        HStack {
                            if authViewModel.isLoading {
                                ProgressView()
                                    .tint(.white)
                            } else {
                                Text(isLogin ? "Login" : "Create Account")
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .frame(height: 48)
                        .background(Color.brandIndigo)
                        .foregroundColor(.white)
                        .cornerRadius(12)
                    }
                    .disabled(authViewModel.isLoading)
                    .padding(.horizontal)

                    // Divider
                    HStack {
                        Rectangle()
                            .fill(Color.gray300)
                            .frame(height: 1)
                        Text("or continue with")
                            .font(.caption)
                            .foregroundColor(.secondary)
                        Rectangle()
                            .fill(Color.gray300)
                            .frame(height: 1)
                    }
                    .padding(.horizontal)

                    // Social Login Buttons
                    VStack(spacing: 12) {
                        // Sign in with Apple
                        SignInWithAppleButton(.signIn) { request in
                            request.requestedScopes = [.email, .fullName]
                        } onCompletion: { result in
                            handleAppleSignIn(result)
                        }
                        .signInWithAppleButtonStyle(.black)
                        .frame(height: 48)
                        .cornerRadius(12)

                        // Google Sign In
                        Button {
                            Task {
                                await authViewModel.signInWithGoogle()
                            }
                        } label: {
                            HStack {
                                Image(systemName: "g.circle.fill")
                                Text("Continue with Google")
                            }
                            .frame(maxWidth: .infinity)
                            .frame(height: 48)
                            .background(Color.gray100)
                            .foregroundColor(.primary)
                            .cornerRadius(12)
                        }
                    }
                    .padding(.horizontal)

                    // Terms
                    Text("By continuing, you agree to our Terms of Service and Privacy Policy")
                        .font(.caption)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)

                    Spacer()
                }
            }
            .alert("Error", isPresented: $authViewModel.showError) {
                Button("OK", role: .cancel) { }
            } message: {
                Text(authViewModel.errorMessage ?? "An error occurred")
            }
        }
    }

    private func handleAppleSignIn(_ result: Result<ASAuthorization, Error>) {
        switch result {
        case .success(let authorization):
            if let appleIDCredential = authorization.credential as? ASAuthorizationAppleIDCredential {
                let userIdentifier = appleIDCredential.user
                let email = appleIDCredential.email ?? ""
                let fullName = [
                    appleIDCredential.fullName?.givenName,
                    appleIDCredential.fullName?.familyName
                ].compactMap { $0 }.joined(separator: " ")

                // Handle Apple sign in
                print("Apple Sign In: \(userIdentifier), \(email), \(fullName)")
            }
        case .failure(let error):
            print("Apple Sign In Error: \(error)")
        }
    }
}

struct StyloTextFieldStyle: TextFieldStyle {
    func _body(configuration: TextField<Self._Label>) -> some View {
        configuration
            .padding()
            .background(Color.gray100)
            .cornerRadius(12)
    }
}

#Preview {
    AuthView()
        .environmentObject(AppState())
        .environmentObject(AuthViewModel())
}
