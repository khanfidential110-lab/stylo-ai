import SwiftUI

struct HomeView: View {
    @EnvironmentObject var appState: AppState
    @StateObject private var viewModel = HomeViewModel()

    var body: some View {
        NavigationStack {
            ScrollView {
                VStack(spacing: 24) {
                    // Weather & Greeting Card
                    WeatherGreetingCard(
                        weather: viewModel.weather,
                        userName: appState.user?.name
                    )
                    .padding(.horizontal)

                    // Today's Outfit Picks
                    if !viewModel.recommendations.isEmpty {
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Today's Picks")
                                .font(.headline)
                                .padding(.horizontal)

                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 16) {
                                    ForEach(viewModel.recommendations) { outfit in
                                        OutfitCard(outfit: outfit)
                                    }
                                }
                                .padding(.horizontal)
                            }
                        }
                    }

                    // Quick Actions
                    QuickActionsGrid()
                        .padding(.horizontal)

                    // Wardrobe Insights
                    if let stats = viewModel.statistics {
                        WardrobeInsightsCard(statistics: stats)
                            .padding(.horizontal)
                    }

                    // Recently Added
                    if !viewModel.recentItems.isEmpty {
                        VStack(alignment: .leading, spacing: 12) {
                            HStack {
                                Text("Recently Added")
                                    .font(.headline)
                                Spacer()
                                NavigationLink("See All") {
                                    WardrobeView()
                                }
                                .font(.subheadline)
                                .foregroundColor(.brandIndigo)
                            }
                            .padding(.horizontal)

                            ScrollView(.horizontal, showsIndicators: false) {
                                HStack(spacing: 12) {
                                    ForEach(viewModel.recentItems) { item in
                                        WardrobeItemThumbnail(item: item)
                                    }
                                }
                                .padding(.horizontal)
                            }
                        }
                    }
                }
                .padding(.vertical)
            }
            .navigationTitle("Home")
            .refreshable {
                await viewModel.refresh()
            }
            .task {
                await viewModel.loadData()
            }
        }
    }
}

struct WeatherGreetingCard: View {
    let weather: WeatherData?
    let userName: String?

    var greeting: String {
        let hour = Calendar.current.component(.hour, from: Date())
        switch hour {
        case 0..<12: return "Good morning"
        case 12..<17: return "Good afternoon"
        default: return "Good evening"
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            HStack {
                VStack(alignment: .leading, spacing: 4) {
                    Text("\(greeting)\(userName != nil ? ", \(userName!)" : "")")
                        .font(.title2.bold())

                    if let weather = weather {
                        Text(weather.city)
                            .font(.subheadline)
                            .foregroundColor(.secondary)
                    }
                }

                Spacer()

                if let weather = weather {
                    HStack(spacing: 8) {
                        Image(systemName: weather.iconSystemName)
                            .font(.title)
                            .foregroundColor(.accentAmber)

                        Text(weather.temperatureDisplay)
                            .font(.title.bold())
                    }
                }
            }

            if let weather = weather {
                Text(weather.description.capitalized)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }
        }
        .padding()
        .background(Color.gray100)
        .cornerRadius(16)
    }
}

struct QuickActionsGrid: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Quick Actions")
                .font(.headline)

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                QuickActionButton(
                    icon: "camera.fill",
                    title: "Analyze Outfit",
                    color: .brandIndigo
                ) {
                    // Navigate to outfit analysis
                }

                QuickActionButton(
                    icon: "sparkles",
                    title: "Get Suggestions",
                    color: .accentAmber
                ) {
                    // Navigate to suggestions
                }

                QuickActionButton(
                    icon: "calendar",
                    title: "Plan Outfit",
                    color: .successGreen
                ) {
                    // Navigate to calendar
                }

                QuickActionButton(
                    icon: "shuffle",
                    title: "Surprise Me",
                    color: .purple
                ) {
                    // Generate random outfit
                }
            }
        }
    }
}

struct QuickActionButton: View {
    let icon: String
    let title: String
    let color: Color
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            VStack(spacing: 8) {
                Image(systemName: icon)
                    .font(.title2)
                    .foregroundColor(color)

                Text(title)
                    .font(.caption)
                    .foregroundColor(.primary)
            }
            .frame(maxWidth: .infinity)
            .padding()
            .background(color.opacity(0.1))
            .cornerRadius(12)
        }
    }
}

struct WardrobeInsightsCard: View {
    let statistics: WardrobeStatistics

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Wardrobe Insights")
                .font(.headline)

            HStack(spacing: 24) {
                InsightItem(
                    value: "\(statistics.totalItems)",
                    label: "Total Items"
                )

                InsightItem(
                    value: "$\(Int(statistics.totalValue))",
                    label: "Total Value"
                )

                InsightItem(
                    value: "\(statistics.unwornStats.last30Days)",
                    label: "Unworn (30d)"
                )
            }
        }
        .padding()
        .background(Color.gray100)
        .cornerRadius(16)
    }
}

struct InsightItem: View {
    let value: String
    let label: String

    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.title2.bold())
                .foregroundColor(.brandIndigo)

            Text(label)
                .font(.caption)
                .foregroundColor(.secondary)
        }
    }
}

struct OutfitCard: View {
    let outfit: Outfit

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Outfit preview placeholder
            RoundedRectangle(cornerRadius: 12)
                .fill(Color.gray100)
                .frame(width: 160, height: 200)
                .overlay {
                    Image(systemName: "tshirt.fill")
                        .font(.largeTitle)
                        .foregroundColor(.gray300)
                }

            if let score = outfit.overallScore {
                HStack(spacing: 4) {
                    Image(systemName: outfit.scoreEmoji)
                        .foregroundColor(.accentAmber)
                    Text("\(score)")
                        .font(.caption.bold())
                }
            }

            Text(outfit.occasion ?? "Casual")
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .frame(width: 160)
    }
}

struct WardrobeItemThumbnail: View {
    let item: WardrobeItem

    var body: some View {
        VStack(spacing: 4) {
            AsyncImage(url: URL(string: item.displayImageUrl)) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                RoundedRectangle(cornerRadius: 8)
                    .fill(Color.gray100)
            }
            .frame(width: 80, height: 80)
            .clipShape(RoundedRectangle(cornerRadius: 8))

            Text(item.name ?? item.category.displayName)
                .font(.caption2)
                .lineLimit(1)
        }
        .frame(width: 80)
    }
}

@MainActor
class HomeViewModel: ObservableObject {
    @Published var weather: WeatherData?
    @Published var recommendations: [Outfit] = []
    @Published var statistics: WardrobeStatistics?
    @Published var recentItems: [WardrobeItem] = []
    @Published var isLoading = false

    func loadData() async {
        isLoading = true

        async let weatherTask = loadWeather()
        async let recommendationsTask = loadRecommendations()
        async let statsTask = loadStatistics()
        async let itemsTask = loadRecentItems()

        await weatherTask
        await recommendationsTask
        await statsTask
        await itemsTask

        isLoading = false
    }

    func refresh() async {
        await loadData()
    }

    private func loadWeather() async {
        do {
            let response = try await APIService.shared.getCurrentWeather(city: "New York")
            weather = response.weather
        } catch {
            print("Failed to load weather: \(error)")
        }
    }

    private func loadRecommendations() async {
        do {
            let response = try await APIService.shared.getOutfitRecommendations(
                occasion: nil,
                city: "New York"
            )
            recommendations = response.outfits
        } catch {
            print("Failed to load recommendations: \(error)")
        }
    }

    private func loadStatistics() async {
        do {
            statistics = try await APIService.shared.getWardrobeStatistics()
        } catch {
            print("Failed to load statistics: \(error)")
        }
    }

    private func loadRecentItems() async {
        do {
            let response = try await APIService.shared.getWardrobeItems(page: 1, limit: 10)
            recentItems = response.items
        } catch {
            print("Failed to load recent items: \(error)")
        }
    }
}

#Preview {
    HomeView()
        .environmentObject(AppState())
}
