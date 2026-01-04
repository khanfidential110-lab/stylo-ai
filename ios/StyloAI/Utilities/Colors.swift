import SwiftUI

extension Color {
    // Brand Colors
    static let brandIndigo = Color(hex: "6366F1")
    static let brandIndigoDark = Color(hex: "4F46E5")
    static let brandIndigoLight = Color(hex: "A5B4FC")

    // Accent Colors
    static let accentAmber = Color(hex: "F59E0B")
    static let successGreen = Color(hex: "10B981")
    static let warningOrange = Color(hex: "F97316")
    static let errorRed = Color(hex: "EF4444")

    // Neutral Colors
    static let gray900 = Color(hex: "111827")
    static let gray700 = Color(hex: "374151")
    static let gray500 = Color(hex: "6B7280")
    static let gray300 = Color(hex: "D1D5DB")
    static let gray100 = Color(hex: "F3F4F6")

    // Dark Mode Colors
    static let darkBackground = Color(hex: "0F172A")
    static let darkSurface = Color(hex: "1E293B")
    static let darkText = Color(hex: "F1F5F9")

    // Initialize from hex string
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(
            .sRGB,
            red: Double(r) / 255,
            green: Double(g) / 255,
            blue: Double(b) / 255,
            opacity: Double(a) / 255
        )
    }

    // Convert to hex string
    var hexString: String {
        guard let components = UIColor(self).cgColor.components else { return "000000" }
        let r = Int(components[0] * 255)
        let g = Int(components[1] * 255)
        let b = Int(components[2] * 255)
        return String(format: "%02X%02X%02X", r, g, b)
    }
}

// Clothing color definitions
struct ClothingColor {
    static let all: [(name: String, hex: String)] = [
        ("Black", "000000"),
        ("White", "FFFFFF"),
        ("Navy", "000080"),
        ("Blue", "0000FF"),
        ("Red", "FF0000"),
        ("Green", "008000"),
        ("Yellow", "FFFF00"),
        ("Orange", "FFA500"),
        ("Purple", "800080"),
        ("Pink", "FFC0CB"),
        ("Brown", "8B4513"),
        ("Gray", "808080"),
        ("Beige", "F5F5DC"),
        ("Cream", "FFFDD0"),
        ("Burgundy", "800020"),
        ("Maroon", "800000"),
        ("Olive", "808000"),
        ("Teal", "008080"),
        ("Coral", "FF7F50"),
        ("Lavender", "E6E6FA"),
        ("Mint", "98FF98"),
        ("Gold", "FFD700"),
        ("Silver", "C0C0C0"),
        ("Tan", "D2B48C"),
        ("Khaki", "F0E68C"),
        ("Denim", "1560BD"),
        ("Charcoal", "36454F"),
    ]

    static func color(for name: String) -> Color {
        if let match = all.first(where: { $0.name.lowercased() == name.lowercased() }) {
            return Color(hex: match.hex)
        }
        return .gray
    }
}
