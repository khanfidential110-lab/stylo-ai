import SwiftUI
import PhotosUI

@MainActor
class WardrobeViewModel: ObservableObject {
    @Published var items: [WardrobeItem] = []
    @Published var filteredItems: [WardrobeItem] = []
    @Published var statistics: WardrobeStatistics?
    @Published var isLoading = false
    @Published var isLoadingMore = false
    @Published var selectedCategory: ClothingCategory?
    @Published var searchText = ""
    @Published var showFavoritesOnly = false
    @Published var currentPage = 1
    @Published var hasMorePages = true
    @Published var errorMessage: String?

    private let pageSize = 20

    init() {
        Task {
            await loadItems()
        }
    }

    func loadItems() async {
        isLoading = true
        currentPage = 1
        hasMorePages = true

        do {
            let response = try await APIService.shared.getWardrobeItems(
                category: selectedCategory,
                page: currentPage,
                limit: pageSize
            )
            items = response.items
            hasMorePages = currentPage < response.totalPages
            applyFilters()
        } catch {
            errorMessage = "Failed to load wardrobe"
        }

        isLoading = false
    }

    func loadMoreItems() async {
        guard !isLoadingMore && hasMorePages else { return }

        isLoadingMore = true
        currentPage += 1

        do {
            let response = try await APIService.shared.getWardrobeItems(
                category: selectedCategory,
                page: currentPage,
                limit: pageSize
            )
            items.append(contentsOf: response.items)
            hasMorePages = currentPage < response.totalPages
            applyFilters()
        } catch {
            currentPage -= 1
        }

        isLoadingMore = false
    }

    func loadStatistics() async {
        do {
            statistics = try await APIService.shared.getWardrobeStatistics()
        } catch {
            print("Failed to load statistics: \(error)")
        }
    }

    func addItem(imageData: Data, metadata: [String: Any]?) async -> WardrobeItem? {
        isLoading = true

        do {
            let newItem = try await APIService.shared.addWardrobeItem(
                imageData: imageData,
                metadata: metadata
            )
            items.insert(newItem, at: 0)
            applyFilters()
            isLoading = false
            return newItem
        } catch {
            errorMessage = "Failed to add item"
            isLoading = false
            return nil
        }
    }

    func updateItem(id: String, updates: [String: Any]) async -> Bool {
        do {
            let updatedItem = try await APIService.shared.updateWardrobeItem(id: id, updates: updates)
            if let index = items.firstIndex(where: { $0.id == id }) {
                items[index] = updatedItem
            }
            applyFilters()
            return true
        } catch {
            errorMessage = "Failed to update item"
            return false
        }
    }

    func deleteItem(id: String) async -> Bool {
        do {
            try await APIService.shared.deleteWardrobeItem(id: id)
            items.removeAll { $0.id == id }
            applyFilters()
            return true
        } catch {
            errorMessage = "Failed to delete item"
            return false
        }
    }

    func toggleFavorite(id: String) async {
        do {
            let updatedItem = try await APIService.shared.toggleFavorite(id: id)
            if let index = items.firstIndex(where: { $0.id == id }) {
                items[index] = updatedItem
            }
            applyFilters()
        } catch {
            print("Failed to toggle favorite: \(error)")
        }
    }

    func markAsWorn(id: String) async {
        do {
            let updatedItem = try await APIService.shared.markAsWorn(id: id)
            if let index = items.firstIndex(where: { $0.id == id }) {
                items[index] = updatedItem
            }
        } catch {
            print("Failed to mark as worn: \(error)")
        }
    }

    func setCategory(_ category: ClothingCategory?) {
        selectedCategory = category
        Task {
            await loadItems()
        }
    }

    func applyFilters() {
        var result = items

        if showFavoritesOnly {
            result = result.filter { $0.isFavorite }
        }

        if !searchText.isEmpty {
            let search = searchText.lowercased()
            result = result.filter {
                ($0.name?.lowercased().contains(search) ?? false) ||
                ($0.brand?.lowercased().contains(search) ?? false) ||
                $0.tags.contains { $0.lowercased().contains(search) }
            }
        }

        filteredItems = result
    }

    func refresh() async {
        await loadItems()
        await loadStatistics()
    }
}
