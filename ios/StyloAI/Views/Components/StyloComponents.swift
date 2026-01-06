import SwiftUI

struct StyloCard<Content: View>: View {
    let content: Content
    var backgroundColor: Color? = nil
    var padded: Bool = true
    
    init(backgroundColor: Color? = nil, padded: Bool = true, @ViewBuilder content: () -> Content) {
        self.content = content()
        self.backgroundColor = backgroundColor
        self.padded = padded
    }
    
    var body: some View {
        VStack(alignment: .leading, spacing: 10) {
            content
        }
        .padding(padded ? 16 : 0)
        .background(
            backgroundColor ?? Color.white.opacity(0.8)
        )
        .cornerRadius(24)
        .shadow(color: Color.black.opacity(0.04), radius: 8, x: 0, y: 2)
        .overlay(
            RoundedRectangle(cornerRadius: 24)
                .stroke(Color.white.opacity(0.5), lineWidth: 1)
        )
    }
}

struct StyloButton: View {
    let title: String
    let icon: String?
    let variant: ButtonVariant
    let action: () -> Void
    
    enum ButtonVariant {
        case primary
        case secondary
        case outline
    }
    
    init(_ title: String, icon: String? = nil, variant: ButtonVariant = .primary, action: @escaping () -> Void) {
        self.title = title
        self.icon = icon
        self.variant = variant
        self.action = action
    }
    
    var body: some View {
        Button(action: action) {
            HStack {
                if let icon = icon {
                    Image(systemName: icon)
                }
                Text(title)
                    .fontWeight(.semibold)
            }
            .frame(maxWidth: .infinity)
            .padding(.vertical, 16)
            .background(backgroundView)
            .foregroundColor(foregroundColor)
            .cornerRadius(16)
            .overlay(
                RoundedRectangle(cornerRadius: 16)
                    .stroke(
                        variant == .outline ? Color.brandIndigo.opacity(0.3) : Color.clear,
                        lineWidth: 1
                    )
            )
            .shadow(color: variant == .primary ? Color.brandIndigo.opacity(0.3) : .clear, radius: 10, x: 0, y: 4)
        }
    }
    
    @ViewBuilder
    var backgroundView: some View {
        switch variant {
        case .primary:
            Color.primaryGradient
        case .secondary:
            Color.brandIndigoLight.opacity(0.2)
        case .outline:
            Color.clear
        }
    }
    
    var foregroundColor: Color {
        switch variant {
        case .primary:
            return .white
        case .secondary:
            return .brandIndigo
        case .outline:
            return .brandIndigo
        }
    }
}

struct StyloTextField: View {
    let title: String
    @Binding var text: String
    var isSecure: Bool = false
    var icon: String? = nil
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.caption)
                .foregroundColor(.gray500)
                .fontWeight(.medium)
            
            HStack {
                if let icon = icon {
                    Image(systemName: icon)
                        .foregroundColor(.gray500)
                }
                
                if isSecure {
                    SecureField("", text: $text)
                } else {
                    TextField("", text: $text)
                }
            }
            .padding()
            .background(Color.white)
            .cornerRadius(12)
            .overlay(
                RoundedRectangle(cornerRadius: 12)
                    .stroke(Color.gray200, lineWidth: 1)
            )
        }
    }
}
