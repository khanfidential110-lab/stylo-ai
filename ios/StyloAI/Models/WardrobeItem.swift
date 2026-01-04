import Foundation

enum ClothingCategory: String, Codable, CaseIterable {
    case tops = "tops"
    case bottoms = "bottoms"
    case dresses = "dresses"
    case outerwear = "outerwear"
    case footwear = "footwear"
    case accessories = "accessories"
    case activewear = "activewear"
    case swimwear = "swimwear"
    case sleepwear = "sleepwear"
    case formal = "formal"

    var displayName: String {
        rawValue.capitalized
    }

    var icon: String {
        switch self {
        case .tops: return "tshirt"
        case .bottoms: return "figure.stand"
        case .dresses: return "figure.dress.line.vertical.figure"
        case .outerwear: return "cloud.sun"
        case .footwear: return "shoe"
        case .accessories: return "eyeglasses"
        case .activewear: return "figure.run"
        case .swimwear: return "figure.pool.swim"
        case .sleepwear: return "bed.double"
        case .formal: return "suit.club"
        }
    }
}

enum Season: String, Codable, CaseIterable {
    case spring = "spring"
    case summer = "summer"
    case fall = "fall"
    case winter = "winter"
    case allSeason = "all-season"

    var displayName: String {
        switch self {
        case .allSeason: return "All Season"
        default: return rawValue.capitalized
        }
    }
}

enum Pattern: String, Codable, CaseIterable {
    case solid = "solid"
    case striped = "striped"
    case floral = "floral"
    case plaid = "plaid"
    case geometric = "geometric"
    case polkaDot = "polka-dot"
    case abstract = "abstract"
    case animalPrint = "animal-print"
    case camo = "camo"
    case tieDye = "tie-dye"

    var displayName: String {
        rawValue.replacingOccurrences(of: "-", with: " ").capitalized
    }
}

struct ColorInfo: Codable {
    let name: String
    let hex: String
}

struct WardrobeItem: Codable, Identifiable {
    let id: String
    let userId: String
    var name: String?
    let category: ClothingCategory
    var subcategory: String?
    let originalImageUrl: String
    var processedImageUrl: String?
    var thumbnailUrl: String?
    var primaryColor: String?
    var primaryColorHex: String?
    var secondaryColors: [ColorInfo]?
    var pattern: Pattern?
    var material: String?
    var season: [Season]
    var occasions: [String]
    var formalityScore: Int?
    var brand: String?
    var size: String?
    var price: Double?
    var isFavorite: Bool
    var timesWorn: Int
    var lastWornAt: Date?
    var tags: [String]
    let createdAt: Date

    enum CodingKeys: String, CodingKey {
        case id
        case userId = "user_id"
        case name, category, subcategory
        case originalImageUrl = "original_image_url"
        case processedImageUrl = "processed_image_url"
        case thumbnailUrl = "thumbnail_url"
        case primaryColor = "primary_color"
        case primaryColorHex = "primary_color_hex"
        case secondaryColors = "secondary_colors"
        case pattern, material, season, occasions
        case formalityScore = "formality_score"
        case brand, size, price
        case isFavorite = "is_favorite"
        case timesWorn = "times_worn"
        case lastWornAt = "last_worn_at"
        case tags
        case createdAt = "created_at"
    }

    var displayImageUrl: String {
        processedImageUrl ?? thumbnailUrl ?? originalImageUrl
    }
}

struct WardrobeResponse: Codable {
    let items: [WardrobeItem]
    let total: Int
    let page: Int
    let limit: Int
    let totalPages: Int

    enum CodingKeys: String, CodingKey {
        case items, total, page, limit
        case totalPages = "total_pages"
    }
}

struct WardrobeStatistics: Codable {
    let totalItems: Int
    let categoryDistribution: [String: Int]
    let colorDistribution: [String: Int]
    let totalValue: Double
    let unwornStats: UnwornStats

    struct UnwornStats: Codable {
        let last30Days: Int
        let last60Days: Int
        let last90Days: Int
    }

    enum CodingKeys: String, CodingKey {
        case totalItems = "total_items"
        case categoryDistribution = "category_distribution"
        case colorDistribution = "color_distribution"
        case totalValue = "total_value"
        case unwornStats = "unworn_stats"
    }
}
