import SwiftUI

struct ProfileView: View {
    @EnvironmentObject var appState: AppState
    @State private var showSubscription = false
    @State private var showStyleProfile = false
    @State private var showSettings = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Profile Header
                    ProfileHeader(user: appState.user)

                    // Subscription Card
                    SubscriptionCard(tier: appState.subscriptionTier) {
                        showSubscription = true
                    }
                    .padding(.horizontal)

                    // Menu Items
                    VStack(spacing: 0) {
                        MenuRow(icon: "person.text.rectangle", title: "Style Profile") {
                            showStyleProfile = true
                        }

                        Divider().padding(.leading, 56)

                        MenuRow(icon: "chart.bar", title: "Wardrobe Analytics") {
                            // Navigate to analytics
                        }

                        Divider().padding(.leading, 56)

                        MenuRow(icon: "calendar", title: "Outfit Calendar") {
                            // Navigate to calendar
                        }

                        Divider().padding(.leading, 56)

                        MenuRow(icon: "heart", title: "Favorites") {
                            // Navigate to favorites
                        }

                        Divider().padding(.leading, 56)

                        MenuRow(icon: "gearshape", title: "Settings") {
                            showSettings = true
                        }

                        Divider().padding(.leading, 56)

                        MenuRow(icon: "questionmark.circle", title: "Help & Support") {
                            // Show help
                        }
                    }
                    .background(Color.white)
                    .cornerRadius(12)
                    .padding(.horizontal)

                    // Logout Button
                    Button {
                        appState.logout()
                    } label: {
                        HStack {
                            Image(systemName: "rectangle.portrait.and.arrow.right")
                            Text("Log Out")
                        }
                        .foregroundColor(.errorRed)
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.errorRed.opacity(0.1))
                        .cornerRadius(12)
                    }
                    .padding(.horizontal)

                    // Version
                    Text("STYLO AI v1.0.0")
                        .font(.caption)
                        .foregroundColor(.secondary)
                }
                .padding(.vertical)
            }
            .background(Color.gray100)
            .navigationTitle("Profile")
            .sheet(isPresented: $showSubscription) {
                SubscriptionView()
            }
            .sheet(isPresented: $showStyleProfile) {
                StyleProfileView()
            }
            .sheet(isPresented: $showSettings) {
                SettingsView()
            }
        }
    }
}

struct ProfileHeader: View {
    let user: User?

    var body: some View {
        VStack(spacing: 12) {
            // Avatar
            if let avatarUrl = user?.avatarUrl, let url = URL(string: avatarUrl) {
                AsyncImage(url: url) { image in
                    image
                        .resizable()
                        .aspectRatio(contentMode: .fill)
                } placeholder: {
                    Circle()
                        .fill(Color.brandIndigo.opacity(0.2))
                        .overlay {
                            Text(user?.name?.prefix(1).uppercased() ?? "?")
                                .font(.largeTitle.bold())
                                .foregroundColor(.brandIndigo)
                        }
                }
                .frame(width: 80, height: 80)
                .clipShape(Circle())
            } else {
                Circle()
                    .fill(Color.brandIndigo.opacity(0.2))
                    .frame(width: 80, height: 80)
                    .overlay {
                        Text(user?.name?.prefix(1).uppercased() ?? "?")
                            .font(.largeTitle.bold())
                            .foregroundColor(.brandIndigo)
                    }
            }

            // Name & Email
            VStack(spacing: 4) {
                Text(user?.name ?? "User")
                    .font(.title2.bold())

                Text(user?.email ?? "")
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
    }
}

struct SubscriptionCard: View {
    let tier: SubscriptionTier
    let onUpgrade: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("Current Plan")
                        .font(.caption)
                        .foregroundColor(.secondary)

                    Text(tier.displayName)
                        .font(.title2.bold())
                }

                Spacer()

                if tier == .free {
                    Button("Upgrade") {
                        onUpgrade()
                    }
                    .buttonStyle(.borderedProminent)
                    .tint(.brandIndigo)
                } else {
                    Image(systemName: "crown.fill")
                        .font(.title)
                        .foregroundColor(.accentAmber)
                }
            }

            if tier == .free {
                Text("Unlock unlimited features with Premium")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
        .background(tier == .free ? Color.gray100 : Color.brandIndigo.opacity(0.1))
        .cornerRadius(16)
    }
}

struct MenuRow: View {
    let icon: String
    let title: String
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 16) {
                Image(systemName: icon)
                    .font(.title3)
                    .foregroundColor(.brandIndigo)
                    .frame(width: 24)

                Text(title)
                    .foregroundColor(.primary)

                Spacer()

                Image(systemName: "chevron.right")
                    .font(.caption)
                    .foregroundColor(.secondary)
            }
            .padding()
        }
    }
}

struct SubscriptionView: View {
    @Environment(\.dismiss) var dismiss
    @State private var plans: [SubscriptionPlan] = []
    @State private var selectedPlan: String?
    @State private var isPurchasing = false

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Header
                    VStack(spacing: 8) {
                        Image(systemName: "crown.fill")
                            .font(.system(size: 50))
                            .foregroundColor(.accentAmber)

                        Text("Unlock Premium")
                            .font(.title.bold())

                        Text("Get unlimited access to all features")
                            .foregroundColor(.secondary)
                    }
                    .padding(.top)

                    // Plans
                    ForEach(plans.filter { $0.id != "free" }) { plan in
                        PlanCard(
                            plan: plan,
                            isSelected: selectedPlan == plan.id
                        ) {
                            selectedPlan = plan.id
                        }
                    }
                    .padding(.horizontal)

                    // Features list
                    VStack(alignment: .leading, spacing: 12) {
                        Text("Premium includes:")
                            .font(.headline)

                        FeatureItem(text: "Unlimited wardrobe items")
                        FeatureItem(text: "Unlimited outfit suggestions")
                        FeatureItem(text: "Unlimited AI chat messages")
                        FeatureItem(text: "Advanced analytics")
                        FeatureItem(text: "No ads")
                    }
                    .padding()
                    .background(Color.gray100)
                    .cornerRadius(16)
                    .padding(.horizontal)

                    // Subscribe button
                    Button {
                        purchase()
                    } label: {
                        if isPurchasing {
                            ProgressView()
                                .tint(.white)
                        } else {
                            Text("Subscribe Now")
                        }
                    }
                    .frame(maxWidth: .infinity)
                    .frame(height: 48)
                    .background(selectedPlan != nil ? Color.brandIndigo : Color.gray300)
                    .foregroundColor(.white)
                    .cornerRadius(12)
                    .disabled(selectedPlan == nil || isPurchasing)
                    .padding(.horizontal)

                    // Restore purchases
                    Button("Restore Purchases") {
                        // Restore
                    }
                    .font(.caption)
                    .foregroundColor(.brandIndigo)

                    // Terms
                    Text("Subscription automatically renews. Cancel anytime in Settings.")
                        .font(.caption2)
                        .foregroundColor(.secondary)
                        .multilineTextAlignment(.center)
                        .padding(.horizontal)
                }
                .padding(.bottom)
            }
            .navigationTitle("Premium")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Close") {
                        dismiss()
                    }
                }
            }
            .task {
                await loadPlans()
            }
        }
    }

    private func loadPlans() async {
        // Load from API
        plans = [
            SubscriptionPlan(
                id: "premium_monthly",
                name: "Premium",
                price: 9.99,
                interval: "month",
                features: [],
                appleProductId: "com.styloai.premium.monthly",
                googleProductId: "premium_monthly"
            ),
            SubscriptionPlan(
                id: "premium_yearly",
                name: "Premium Annual",
                price: 79.99,
                interval: "year",
                features: [],
                appleProductId: "com.styloai.premium.yearly",
                googleProductId: "premium_yearly"
            ),
        ]
    }

    private func purchase() {
        isPurchasing = true
        // Implement StoreKit purchase
    }
}

struct PlanCard: View {
    let plan: SubscriptionPlan
    let isSelected: Bool
    let onSelect: () -> Void

    var body: some View {
        Button(action: onSelect) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text(plan.name)
                        .font(.headline)

                    Text("$\(plan.price, specifier: "%.2f")/\(plan.interval)")
                        .font(.subheadline)
                        .foregroundColor(.secondary)
                }

                Spacer()

                Image(systemName: isSelected ? "checkmark.circle.fill" : "circle")
                    .foregroundColor(isSelected ? .brandIndigo : .gray300)
                    .font(.title2)
            }
            .padding()
            .background(isSelected ? Color.brandIndigo.opacity(0.1) : Color.gray100)
            .cornerRadius(12)
            .overlay {
                RoundedRectangle(cornerRadius: 12)
                    .stroke(isSelected ? Color.brandIndigo : Color.clear, lineWidth: 2)
            }
        }
        .foregroundColor(.primary)
    }
}

struct FeatureItem: View {
    let text: String

    var body: some View {
        HStack(spacing: 12) {
            Image(systemName: "checkmark.circle.fill")
                .foregroundColor(.successGreen)
            Text(text)
        }
    }
}

struct StyleProfileView: View {
    @Environment(\.dismiss) var dismiss

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 24) {
                    Text("Tell us about your style preferences to get better recommendations")
                        .foregroundColor(.secondary)
                        .padding(.horizontal)

                    // Style tags, colors, etc. would go here
                    Text("Style profile editing coming soon...")
                        .padding()
                }
            }
            .navigationTitle("Style Profile")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
}

struct SettingsView: View {
    @Environment(\.dismiss) var dismiss
    @EnvironmentObject var appState: AppState

    var body: some View {
        NavigationStack {
            List {
                Section("Preferences") {
                    // Temperature unit
                    HStack {
                        Text("Temperature")
                        Spacer()
                        Text(appState.user?.temperatureUnit == .celsius ? "Celsius" : "Fahrenheit")
                            .foregroundColor(.secondary)
                    }
                }

                Section("Notifications") {
                    Toggle("Daily Outfit Suggestions", isOn: .constant(true))
                    Toggle("Weather Alerts", isOn: .constant(true))
                    Toggle("Style Tips", isOn: .constant(false))
                }

                Section("Privacy") {
                    NavigationLink("Privacy Policy") {
                        Text("Privacy Policy")
                    }
                    NavigationLink("Terms of Service") {
                        Text("Terms of Service")
                    }
                }

                Section("Account") {
                    Button("Delete Account", role: .destructive) {
                        // Delete account
                    }
                }
            }
            .navigationTitle("Settings")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .confirmationAction) {
                    Button("Done") {
                        dismiss()
                    }
                }
            }
        }
    }
}

#Preview {
    ProfileView()
        .environmentObject(AppState())
}
