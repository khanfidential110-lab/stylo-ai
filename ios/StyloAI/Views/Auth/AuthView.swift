import SwiftUI
import AuthenticationServices

struct AuthView: View {
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var authViewModel: AuthViewModel
    @State private var isLogin = true
    
    var body: some View {
        NavigationStack {
            ZStack {
                // Background
                Theme.primaryGradient
                    .ignoresSafeArea()
                    .overlay(
                        Color.black.opacity(0.1)
                    )
                
                ScrollView {
                    VStack(spacing: 32) {
                        Spacer(minLength: 40)
                        
                        // Logo Section
                        VStack(spacing: 12) {
                            Image(systemName: "tshirt.fill")
                                .font(.system(size: 64))
                                .foregroundColor(.white)
                                .shadow(radius: 10)
                            
                            Text("STYLO AI")
                                .font(.system(size: 36, weight: .bold))
                                .foregroundColor(.white)
                                .shadow(radius: 5)
                            
                            Text("Your Personal AI Stylist")
                                .font(.subheadline)
                                .foregroundColor(.white.opacity(0.9))
                        }
                        
                        // Auth Card
                        VStack(spacing: 24) {
                            // Tabs
                            HStack(spacing: 0) {
                                AuthTabButton(title: "Login", isSelected: isLogin) {
                                    withAnimation { isLogin = true }
                                }
                                AuthTabButton(title: "Sign Up", isSelected: !isLogin) {
                                    withAnimation { isLogin = false }
                                }
                            }
                            .padding(4)
                            .background(Color.white.opacity(0.2))
                            .cornerRadius(12)
                            .padding(.horizontal)
                            .padding(.top)
                            
                            // Form
                            VStack(spacing: 20) {
                                if !isLogin {
                                    StyloTextField(title: "Full Name", text: $authViewModel.name, icon: "person")
                                }
                                
                                StyloTextField(title: "Email", text: $authViewModel.email, icon: "envelope")
                                    .textContentType(.emailAddress)
                                    .keyboardType(.emailAddress)
                                    .textInputAutocapitalization(.never)
                                
                                StyloTextField(title: "Password", text: $authViewModel.password, isSecure: true, icon: "lock")
                                    .textContentType(isLogin ? .password : .newPassword)
                            }
                            .padding(.horizontal)
                            
                            // Action Button
                            StyloButton(isLogin ? "Login" : "Create Account", variant: .primary) {
                                Task {
                                    let success = isLogin
                                        ? await authViewModel.login()
                                        : await authViewModel.register()
                                    if success {
                                        appState.isLoggedIn = true
                                        await appState.loadUserProfile()
                                    }
                                }
                            }
                            .disabled(authViewModel.isLoading)
                            .opacity(authViewModel.isLoading ? 0.7 : 1)
                            .padding(.horizontal)
                            .padding(.bottom)
                        }
                        .background(.thinMaterial)
                        .cornerRadius(24)
                        .overlay(
                            RoundedRectangle(cornerRadius: 24)
                                .stroke(Color.white.opacity(0.3), lineWidth: 1)
                        )
                        .padding(.horizontal)
                        .shadow(color: Color.black.opacity(0.15), radius: 20, x: 0, y: 10)
                        
                        // Social Login
                        VStack(spacing: 16) {
                            HStack {
                                Rectangle().fill(Color.white.opacity(0.3)).frame(height: 1)
                                Text("Or continue with")
                                    .font(.caption)
                                    .foregroundColor(.white.opacity(0.8))
                                Rectangle().fill(Color.white.opacity(0.3)).frame(height: 1)
                            }
                            .padding(.horizontal, 40)
                            
                            HStack(spacing: 20) {
                                SocialButton(icon: "apple.logo", action: {})
                                SocialButton(icon: "g.circle.fill", action: {
                                    Task { await authViewModel.signInWithGoogle() }
                                })
                            }
                        }
                        
                        Spacer()
                    }
                    .padding(.bottom, 40)
                }
            }
            .alert("Error", isPresented: $authViewModel.showError) {
                Button("OK", role: .cancel) { }
            } message: {
                Text(authViewModel.errorMessage ?? "An error occurred")
            }
        }
    }
}

struct AuthTabButton: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.headline)
                .foregroundColor(isSelected ? .brandIndigo : .white)
                .frame(maxWidth: .infinity)
                .padding(.vertical, 10)
                .background(
                     isSelected ? Color.white : Color.clear
                )
                .cornerRadius(10)
        }
    }
}

struct SocialButton: View {
    let icon: String
    let action: () -> Void
    
    var body: some View {
        Button(action: action) {
            Image(systemName: icon)
                .font(.system(size: 24))
                .foregroundColor(.white)
                .frame(width: 56, height: 56)
                .background(
                    Circle()
                        .fill(Color.white.opacity(0.2))
                        .overlay(Circle().stroke(Color.white.opacity(0.3), lineWidth: 1))
                )
        }
    }
}

struct AuthView_Previews: PreviewProvider {
    static var previews: some View {
        AuthView()
            .environmentObject(AppState())
            .environmentObject(AuthViewModel())
    }
}
