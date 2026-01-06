import SwiftUI

struct HomeView: View {
    @EnvironmentObject var appState: AppState
    @StateObject private var viewModel = HomeViewModel()

    var body: some View {
        NavigationStack {
            ZStack {
                // Background
                Color.gray50.ignoresSafeArea()
                
                ScrollView {
                    VStack(spacing: 24) {
                        // Weather & Greeting
                        WeatherGreetingCard(
                            weather: viewModel.weather,
                            userName: appState.user?.name
                        )
                        .padding(.horizontal)

                        // Daily Tip
                        DailyTipCard()
                             .padding(.horizontal)

                        // Quick Actions
                        QuickActionsGrid()
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

                        // Wardrobe Insights
                        if let stats = viewModel.statistics {
                            WardrobeInsightsCard(statistics: stats)
                                .padding(.horizontal)
                        }
                    }
                    .padding(.vertical)
                }
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
        StyloCard(backgroundColor: .clear, padded: false) {
            ZStack {
                Theme.primaryGradient
                
                HStack {
                    VStack(alignment: .leading, spacing: 4) {
                        Text("\(greeting),")
                            .font(.title3)
                            .foregroundColor(.white.opacity(0.9))
                        Text(userName ?? "Stylo User")
                            .font(.title.bold())
                            .foregroundColor(.white)
                        
                        if let weather = weather {
                            HStack {
                                Image(systemName: "location.fill")
                                    .font(.caption)
                                Text(weather.city)
                                    .font(.subheadline.weight(.medium))
                            }
                            .foregroundColor(.white.opacity(0.8))
                            .padding(.top, 4)
                        }
                    }
                    
                    Spacer()
                    
                    if let weather = weather {
                        VStack(alignment: .trailing, spacing: 0) {
                            Image(systemName: weather.iconSystemName)
                                .font(.system(size: 40))
                                .foregroundColor(.white)
                                .shadow(radius: 2)
                            
                            Text(weather.temperatureDisplay)
                                .font(.system(size: 32, weight: .bold))
                                .foregroundColor(.white)
                            
                            Text(weather.description.capitalized)
                                .font(.caption)
                                .foregroundColor(.white.opacity(0.9))
                        }
                    }
                }
                .padding(20)
            }
        }
    }
}

struct DailyTipCard: View {
    var body: some View {
        StyloCard {
            HStack(spacing: 16) {
                Image(systemName: "lightbulb.fill")
                    .font(.title2)
                    .foregroundColor(.accentAmber)
                    .frame(width: 40, height: 40)
                    .background(Color.accentAmber.opacity(0.1))
                    .clipShape(Circle())
                
                VStack(alignment: .leading, spacing: 4) {
                    Text("Daily Tip")
                        .font(.caption.bold())
                        .foregroundColor(.secondary)
                    Text("Monochrome outfits elongate the silhouette.")
                        .font(.subheadline)
                        .foregroundColor(.primary)
                }
            }
        }
    }
}

struct QuickActionsGrid: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("Quick Actions")
                .font(.headline)
                .padding(.leading, 4)

            LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
                QuickActionButton(
                    icon: "camera.fill",
                    title: "Analyze",
                    color: .brandIndigo
                ) {}
                
                QuickActionButton(
                    icon: "sparkles",
                    title: "Suggestions",
                    color: .accentAmber
                ) {}
                
                QuickActionButton(
                    icon: "tshirt.fill",
                    title: "Wardrobe",
                    color: .successGreen
                ) {}
                
                QuickActionButton(
                    icon: "calendar",
                    title: "Calendar",
                    color: .purple
                ) {}
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
            VStack(spacing: 12) {
                Image(systemName: icon)
                    .font(.title2)
                    .foregroundColor(color)
                    .frame(width: 48, height: 48)
                    .background(color.opacity(0.1))
                    .clipShape(Circle())

                Text(title)
                    .font(.subheadline.weight(.medium))
                    .foregroundColor(.primary)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(Color.white)
            .cornerRadius(16)
            .shadow(color: Color.black.opacity(0.03), radius: 5, x: 0, y: 2)
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(Color.gray100, lineWidth: 1)
            )
        }
    }
}

struct WardrobeInsightsCard: View {
    let statistics: WardrobeStatistics

    var body: some View {
        StyloCard {
            VStack(alignment: .leading, spacing: 16) {
                HStack {
                    Text("Wardrobe Analytics")
                        .font(.headline)
                    Spacer()
                    Image(systemName: "chart.bar.fill")
                        .foregroundColor(.brandIndigo)
                }
                
                Divider()

                HStack(spacing: 0) {
                    InsightItem(
                        value: "\(statistics.totalItems)",
                        label: "Items"
                    )
                    Divider()
                    InsightItem(
                        value: "$\(Int(statistics.totalValue))",
                        label: "Value"
                    )
                    Divider()
                    InsightItem(
                        value: "\(statistics.unwornStats.last30Days)",
                        label: "Unworn"
                    )
                }
            }
        }
    }
}

struct InsightItem: View {
    let value: String
    let label: String

    var body: some View {
        VStack(spacing: 4) {
            Text(value)
                .font(.title3.bold())
                .foregroundColor(.brandIndigo)
            Text(label)
                .font(.caption)
                .foregroundColor(.secondary)
        }
        .frame(maxWidth: .infinity)
    }
}

// Keep OutletCard and WardrobeItemThumbnail as placeholders or reuse existing logic if simple
struct OutfitCard: View {
    let outfit: Outfit
    var body: some View {
        StyloCard(padded: false) {
             VStack(alignment: .leading) {
                 Rectangle().fill(Color.gray200).frame(height: 120)
                 VStack(alignment: .leading, spacing: 4) {
                     Text(outfit.overallScore.map { "\($0)" } ?? "N/A")
                         .font(.headline)
                     Text(outfit.occasion ?? "Casual")
                         .font(.caption).foregroundColor(.secondary)
                 }
                 .padding(12)
             }
             .frame(width: 140)
        }
    }
}

// ViewModel remains same (implied)
