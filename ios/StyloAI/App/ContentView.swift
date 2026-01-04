import SwiftUI

struct ContentView: View {
    @EnvironmentObject var appState: AppState
    @EnvironmentObject var authViewModel: AuthViewModel

    var body: some View {
        Group {
            if appState.isLoggedIn {
                MainTabView()
            } else {
                AuthView()
            }
        }
        .animation(.easeInOut, value: appState.isLoggedIn)
    }
}

struct MainTabView: View {
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem {
                    Image(systemName: selectedTab == 0 ? "house.fill" : "house")
                    Text("Home")
                }
                .tag(0)

            WardrobeView()
                .tabItem {
                    Image(systemName: selectedTab == 1 ? "tshirt.fill" : "tshirt")
                    Text("Wardrobe")
                }
                .tag(1)

            CameraView()
                .tabItem {
                    Image(systemName: "camera.fill")
                    Text("Add")
                }
                .tag(2)

            ChatView()
                .tabItem {
                    Image(systemName: selectedTab == 3 ? "bubble.left.and.bubble.right.fill" : "bubble.left.and.bubble.right")
                    Text("Chat")
                }
                .tag(3)

            ProfileView()
                .tabItem {
                    Image(systemName: selectedTab == 4 ? "person.fill" : "person")
                    Text("Profile")
                }
                .tag(4)
        }
        .tint(Color.brandIndigo)
    }
}

#Preview {
    ContentView()
        .environmentObject(AppState())
        .environmentObject(AuthViewModel())
}
