import Foundation

struct OutfitItem: Codable {
    let itemId: String
    let position: String

    enum CodingKeys: String, CodingKey {
        case itemId = "item_id"
        case position
    }
}

struct OutfitScoreDetail: Codable {
    let score: Int
    let feedback: String
}

struct OutfitFeedback: Codable {
    let colorHarmony: OutfitScoreDetail
    let styleCoherence: OutfitScoreDetail
    let occasionFit: OutfitScoreDetail
    let weatherSuitability: OutfitScoreDetail
    let completeness: OutfitScoreDetail
    let compliments: [String]
    let suggestions: [String]
    let warnings: [String]

    enum CodingKeys: String, CodingKey {
        case colorHarmony = "color_harmony"
        case styleCoherence = "style_coherence"
        case occasionFit = "occasion_fit"
        case weatherSuitability = "weather_suitability"
        case completeness
        case compliments, suggestions, warnings
    }
}

struct Outfit: Codable, Identifiable {
    let id: String
    let userId: String
    var name: String?
    let items: [OutfitItem]
    var occasion: String?
    var overallScore: Int?
    var aiFeedback: OutfitFeedback?
    var outfitImageUrl: String?
    var isSaved: Bool
    var wornDate: Date?
    var userRating: Int?
    var notes: String?
    let createdAt: Date

    enum CodingKeys: String, CodingKey {
        case id
        case userId = "user_id"
        case name, items, occasion
        case overallScore = "overall_score"
        case aiFeedback = "ai_feedback"
        case outfitImageUrl = "outfit_image_url"
        case isSaved = "is_saved"
        case wornDate = "worn_date"
        case userRating = "user_rating"
        case notes
        case createdAt = "created_at"
    }

    var scoreLabel: String {
        guard let score = overallScore else { return "Not scored" }
        switch score {
        case 90...100: return "Perfect!"
        case 80..<90: return "Great outfit!"
        case 70..<80: return "Good, minor tweaks"
        case 60..<70: return "Acceptable"
        default: return "Consider alternatives"
        }
    }

    var scoreEmoji: String {
        guard let score = overallScore else { return "" }
        switch score {
        case 90...100: return "star.fill"
        case 80..<90: return "sparkles"
        case 70..<80: return "hand.thumbsup.fill"
        case 60..<70: return "arrow.triangle.2.circlepath"
        default: return "arrow.left.arrow.right"
        }
    }
}

struct OutfitRecommendationRequest: Codable {
    let occasion: String?
    let city: String?
    let date: Date?
}

struct OutfitRecommendationResponse: Codable {
    let outfits: [Outfit]
    let weather: WeatherData?
}
