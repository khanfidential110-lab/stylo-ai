import SwiftUI

struct Theme {
    static let tint = Color.brandIndigo
}

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
    static let gray700 = Color(hex: "374151") // Slate 700
    static let gray500 = Color(hex: "6B7280")
    static let gray300 = Color(hex: "CBD5E1") // Slate 300
    static let gray200 = Color(hex: "E2E8F0") // Slate 200
    static let gray100 = Color(hex: "F1F5F9") // Slate 100
    static let gray50 = Color(hex: "F8FAFC")  // Slate 50

    // Dark Mode
    static let darkBackground = Color(hex: "0F172A")
    static let darkSurface = Color(hex: "1E293B")
    static let darkText = Color(hex: "F8FAFC")

    // Gradients
    static let primaryGradient = LinearGradient(
        colors: [Color(hex: "6366F1"), Color(hex: "8B5CF6")],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )
    
    static let glassGradient = LinearGradient(
        colors: [Color.white.opacity(0.8), Color.white.opacity(0.4)],
        startPoint: .topLeading,
        endPoint: .bottomTrailing
    )

    // Init from Hex
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
}

struct GlassModifier: ViewModifier {
    var cornerRadius: CGFloat = 20
    
    func body(content: Content) -> some View {
        content
            .background(.thinMaterial)
            .background(Color.white.opacity(0.1))
            .clipShape(RoundedRectangle(cornerRadius: cornerRadius))
            .overlay(
                RoundedRectangle(cornerRadius: cornerRadius)
                    .stroke(Color.white.opacity(0.3), lineWidth: 1)
            )
            .shadow(color: Color.black.opacity(0.05), radius: 10, x: 0, y: 5)
    }
}

extension View {
    func glass(cornerRadius: CGFloat = 20) -> some View {
        modifier(GlassModifier(cornerRadius: cornerRadius))
    }
}
