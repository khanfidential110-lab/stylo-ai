import Foundation

enum SubscriptionTier: String, Codable {
    case free = "free"
    case premium = "premium"
    case premiumPlus = "premium_plus"

    var displayName: String {
        switch self {
        case .free: return "Free"
        case .premium: return "Premium"
        case .premiumPlus: return "Premium+"
        }
    }
}

enum TemperatureUnit: String, Codable {
    case fahrenheit = "fahrenheit"
    case celsius = "celsius"
}

struct User: Codable, Identifiable {
    let id: String
    let email: String
    var name: String?
    var avatarUrl: String?
    var city: String?
    var timezone: String?
    var temperatureUnit: TemperatureUnit
    var subscriptionTier: SubscriptionTier
    var subscriptionExpiresAt: Date?
    let createdAt: Date

    enum CodingKeys: String, CodingKey {
        case id, email, name, city, timezone
        case avatarUrl = "avatar_url"
        case temperatureUnit = "temperature_unit"
        case subscriptionTier = "subscription_tier"
        case subscriptionExpiresAt = "subscription_expires_at"
        case createdAt = "created_at"
    }
}

struct StyleProfile: Codable {
    let id: String
    var styleTags: [String]
    var preferredColors: [String]
    var avoidedColors: [String]
    var formalityPreference: Int?
    var preferredBrands: [String]
    var bodyType: String?
    var height: String?
    var preferredFit: String?
    var styleInspirations: [String]

    enum CodingKeys: String, CodingKey {
        case id
        case styleTags = "style_tags"
        case preferredColors = "preferred_colors"
        case avoidedColors = "avoided_colors"
        case formalityPreference = "formality_preference"
        case preferredBrands = "preferred_brands"
        case bodyType = "body_type"
        case height
        case preferredFit = "preferred_fit"
        case styleInspirations = "style_inspirations"
    }
}

struct AuthTokens: Codable {
    let accessToken: String
    let refreshToken: String
    let expiresIn: Int

    enum CodingKeys: String, CodingKey {
        case accessToken = "access_token"
        case refreshToken = "refresh_token"
        case expiresIn = "expires_in"
    }
}
