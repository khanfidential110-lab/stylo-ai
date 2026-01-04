import Foundation

enum APIError: Error {
    case invalidURL
    case noData
    case decodingError(Error)
    case serverError(String)
    case unauthorized
    case networkError(Error)
}

class APIService {
    static let shared = APIService()
    private let baseURL = "https://api.stylo-ai.com/api/v1"
    private let decoder: JSONDecoder

    private init() {
        decoder = JSONDecoder()
        decoder.dateDecodingStrategy = .iso8601
    }

    // MARK: - Auth

    func register(email: String, password: String, name: String?) async throws -> AuthTokens {
        let body: [String: Any] = [
            "email": email,
            "password": password,
            "name": name ?? ""
        ]
        return try await post(endpoint: "/auth/register", body: body)
    }

    func login(email: String, password: String) async throws -> AuthTokens {
        let body = ["email": email, "password": password]
        return try await post(endpoint: "/auth/login", body: body)
    }

    func refreshToken() async throws -> AuthTokens {
        guard let refreshToken = KeychainHelper.shared.getRefreshToken() else {
            throw APIError.unauthorized
        }
        let body = ["refreshToken": refreshToken]
        return try await post(endpoint: "/auth/refresh", body: body)
    }

    // MARK: - User

    func getCurrentUser() async throws -> User {
        return try await get(endpoint: "/users/me")
    }

    func updateUser(_ updates: [String: Any]) async throws -> User {
        return try await patch(endpoint: "/users/me", body: updates)
    }

    func getStyleProfile() async throws -> StyleProfile {
        return try await get(endpoint: "/users/me/style-profile")
    }

    func updateStyleProfile(_ profile: [String: Any]) async throws -> StyleProfile {
        return try await put(endpoint: "/users/me/style-profile", body: profile)
    }

    // MARK: - Wardrobe

    func getWardrobeItems(
        category: ClothingCategory? = nil,
        color: String? = nil,
        season: Season? = nil,
        page: Int = 1,
        limit: Int = 20
    ) async throws -> WardrobeResponse {
        var queryItems: [URLQueryItem] = [
            URLQueryItem(name: "page", value: String(page)),
            URLQueryItem(name: "limit", value: String(limit))
        ]
        if let category = category {
            queryItems.append(URLQueryItem(name: "category", value: category.rawValue))
        }
        if let color = color {
            queryItems.append(URLQueryItem(name: "color", value: color))
        }
        if let season = season {
            queryItems.append(URLQueryItem(name: "season", value: season.rawValue))
        }
        return try await get(endpoint: "/wardrobe", queryItems: queryItems)
    }

    func getWardrobeItem(id: String) async throws -> WardrobeItem {
        return try await get(endpoint: "/wardrobe/\(id)")
    }

    func addWardrobeItem(imageData: Data, metadata: [String: Any]?) async throws -> WardrobeItem {
        return try await uploadImage(endpoint: "/wardrobe", imageData: imageData, metadata: metadata)
    }

    func updateWardrobeItem(id: String, updates: [String: Any]) async throws -> WardrobeItem {
        return try await patch(endpoint: "/wardrobe/\(id)", body: updates)
    }

    func deleteWardrobeItem(id: String) async throws {
        try await delete(endpoint: "/wardrobe/\(id)")
    }

    func toggleFavorite(id: String) async throws -> WardrobeItem {
        return try await post(endpoint: "/wardrobe/\(id)/favorite", body: [:])
    }

    func markAsWorn(id: String) async throws -> WardrobeItem {
        return try await post(endpoint: "/wardrobe/\(id)/wear", body: [:])
    }

    func getWardrobeStatistics() async throws -> WardrobeStatistics {
        return try await get(endpoint: "/wardrobe/statistics")
    }

    // MARK: - Outfits

    func getOutfitRecommendations(occasion: String?, city: String?) async throws -> OutfitRecommendationResponse {
        var body: [String: Any] = [:]
        if let occasion = occasion { body["occasion"] = occasion }
        if let city = city { body["city"] = city }
        return try await post(endpoint: "/outfits/recommend", body: body)
    }

    func analyzeOutfit(imageUrl: String?, itemIds: [String]?, occasion: String?) async throws -> Outfit {
        var body: [String: Any] = [:]
        if let imageUrl = imageUrl { body["imageUrl"] = imageUrl }
        if let itemIds = itemIds { body["itemIds"] = itemIds }
        if let occasion = occasion { body["occasion"] = occasion }
        let response: [String: Any] = try await post(endpoint: "/outfits/analyze", body: body)
        // Handle nested response
        return try await getOutfit(id: response["outfit"] as? String ?? "")
    }

    func getSavedOutfits(page: Int = 1) async throws -> [Outfit] {
        let response: [String: Any] = try await get(endpoint: "/outfits", queryItems: [
            URLQueryItem(name: "page", value: String(page))
        ])
        // Parse response
        return []
    }

    func getOutfit(id: String) async throws -> Outfit {
        return try await get(endpoint: "/outfits/\(id)")
    }

    func saveOutfit(_ outfit: [String: Any]) async throws -> Outfit {
        return try await post(endpoint: "/outfits", body: outfit)
    }

    func deleteOutfit(id: String) async throws {
        try await delete(endpoint: "/outfits/\(id)")
    }

    // MARK: - Weather

    func getCurrentWeather(city: String) async throws -> WeatherResponse {
        return try await get(endpoint: "/weather", queryItems: [
            URLQueryItem(name: "city", value: city)
        ])
    }

    func getForecast(city: String, days: Int = 7) async throws -> [ForecastData] {
        return try await get(endpoint: "/weather/forecast", queryItems: [
            URLQueryItem(name: "city", value: city),
            URLQueryItem(name: "days", value: String(days))
        ])
    }

    // MARK: - Chat

    func sendChatMessage(message: String, conversationId: String?) async throws -> ChatResponse {
        var body: [String: Any] = ["message": message]
        if let conversationId = conversationId {
            body["conversationId"] = conversationId
        }
        return try await post(endpoint: "/chat", body: body)
    }

    func getConversations() async throws -> [Conversation] {
        return try await get(endpoint: "/chat/conversations")
    }

    func getConversation(id: String) async throws -> [ChatMessage] {
        let response: [String: Any] = try await get(endpoint: "/chat/conversations/\(id)")
        return []
    }

    // MARK: - Subscription

    func getSubscriptionPlans() async throws -> [SubscriptionPlan] {
        return try await get(endpoint: "/subscription/plans")
    }

    func verifyApplePurchase(receiptData: String) async throws -> SubscriptionVerificationResponse {
        return try await post(endpoint: "/subscription/verify/apple", body: ["receiptData": receiptData])
    }

    func startTrial() async throws -> SubscriptionInfo {
        return try await post(endpoint: "/subscription/trial", body: [:])
    }

    // MARK: - Private Helpers

    private func get<T: Decodable>(endpoint: String, queryItems: [URLQueryItem] = []) async throws -> T {
        var components = URLComponents(string: baseURL + endpoint)
        if !queryItems.isEmpty {
            components?.queryItems = queryItems
        }
        guard let url = components?.url else { throw APIError.invalidURL }

        var request = URLRequest(url: url)
        request.httpMethod = "GET"
        addAuthHeader(&request)

        return try await executeRequest(request)
    }

    private func post<T: Decodable>(endpoint: String, body: [String: Any]) async throws -> T {
        guard let url = URL(string: baseURL + endpoint) else { throw APIError.invalidURL }

        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        addAuthHeader(&request)

        return try await executeRequest(request)
    }

    private func patch<T: Decodable>(endpoint: String, body: [String: Any]) async throws -> T {
        guard let url = URL(string: baseURL + endpoint) else { throw APIError.invalidURL }

        var request = URLRequest(url: url)
        request.httpMethod = "PATCH"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        addAuthHeader(&request)

        return try await executeRequest(request)
    }

    private func put<T: Decodable>(endpoint: String, body: [String: Any]) async throws -> T {
        guard let url = URL(string: baseURL + endpoint) else { throw APIError.invalidURL }

        var request = URLRequest(url: url)
        request.httpMethod = "PUT"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.httpBody = try JSONSerialization.data(withJSONObject: body)
        addAuthHeader(&request)

        return try await executeRequest(request)
    }

    private func delete(endpoint: String) async throws {
        guard let url = URL(string: baseURL + endpoint) else { throw APIError.invalidURL }

        var request = URLRequest(url: url)
        request.httpMethod = "DELETE"
        addAuthHeader(&request)

        let (_, response) = try await URLSession.shared.data(for: request)
        guard let httpResponse = response as? HTTPURLResponse,
              200..<300 ~= httpResponse.statusCode else {
            throw APIError.serverError("Delete failed")
        }
    }

    private func uploadImage<T: Decodable>(
        endpoint: String,
        imageData: Data,
        metadata: [String: Any]?
    ) async throws -> T {
        guard let url = URL(string: baseURL + endpoint) else { throw APIError.invalidURL }

        let boundary = UUID().uuidString
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("multipart/form-data; boundary=\(boundary)", forHTTPHeaderField: "Content-Type")
        addAuthHeader(&request)

        var body = Data()

        // Add image
        body.append("--\(boundary)\r\n".data(using: .utf8)!)
        body.append("Content-Disposition: form-data; name=\"image\"; filename=\"image.jpg\"\r\n".data(using: .utf8)!)
        body.append("Content-Type: image/jpeg\r\n\r\n".data(using: .utf8)!)
        body.append(imageData)
        body.append("\r\n".data(using: .utf8)!)

        // Add metadata fields
        if let metadata = metadata {
            for (key, value) in metadata {
                body.append("--\(boundary)\r\n".data(using: .utf8)!)
                body.append("Content-Disposition: form-data; name=\"\(key)\"\r\n\r\n".data(using: .utf8)!)
                body.append("\(value)\r\n".data(using: .utf8)!)
            }
        }

        body.append("--\(boundary)--\r\n".data(using: .utf8)!)
        request.httpBody = body

        return try await executeRequest(request)
    }

    private func executeRequest<T: Decodable>(_ request: URLRequest) async throws -> T {
        let (data, response) = try await URLSession.shared.data(for: request)

        guard let httpResponse = response as? HTTPURLResponse else {
            throw APIError.serverError("Invalid response")
        }

        if httpResponse.statusCode == 401 {
            // Try to refresh token
            do {
                let tokens = try await refreshToken()
                KeychainHelper.shared.saveTokens(tokens)
                var newRequest = request
                addAuthHeader(&newRequest)
                return try await executeRequest(newRequest)
            } catch {
                throw APIError.unauthorized
            }
        }

        guard 200..<300 ~= httpResponse.statusCode else {
            if let errorMessage = String(data: data, encoding: .utf8) {
                throw APIError.serverError(errorMessage)
            }
            throw APIError.serverError("Request failed with status \(httpResponse.statusCode)")
        }

        do {
            return try decoder.decode(T.self, from: data)
        } catch {
            throw APIError.decodingError(error)
        }
    }

    private func addAuthHeader(_ request: inout URLRequest) {
        if let token = KeychainHelper.shared.getAccessToken() {
            request.setValue("Bearer \(token)", forHTTPHeaderField: "Authorization")
        }
    }
}

// Subscription Models for API
struct SubscriptionPlan: Codable, Identifiable {
    let id: String
    let name: String
    let price: Double
    let interval: String
    let features: [String]
    let appleProductId: String
    let googleProductId: String

    enum CodingKeys: String, CodingKey {
        case id, name, price, interval, features
        case appleProductId = "apple_product_id"
        case googleProductId = "google_product_id"
    }
}

struct SubscriptionVerificationResponse: Codable {
    let success: Bool
    let subscription: SubscriptionInfo?
}

struct SubscriptionInfo: Codable {
    let id: String
    let tier: String
    let status: String
    let currentPeriodEnd: Date?

    enum CodingKeys: String, CodingKey {
        case id, tier, status
        case currentPeriodEnd = "current_period_end"
    }
}
