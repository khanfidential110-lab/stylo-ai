import SwiftUI

struct DisplayMessage: Identifiable {
    let id = UUID()
    let role: MessageRole
    let content: String
    let quickActions: [QuickAction]?
    let timestamp: Date

    init(role: MessageRole, content: String, quickActions: [QuickAction]? = nil) {
        self.role = role
        self.content = content
        self.quickActions = quickActions
        self.timestamp = Date()
    }

    init(from chatMessage: ChatMessage) {
        self.role = chatMessage.role
        self.content = chatMessage.content
        self.quickActions = nil
        self.timestamp = chatMessage.createdAt
    }
}

@MainActor
class ChatViewModel: ObservableObject {
    @Published var messages: [DisplayMessage] = []
    @Published var inputText = ""
    @Published var isLoading = false
    @Published var conversationId: String?
    @Published var conversations: [Conversation] = []

    init() {
        addWelcomeMessage()
    }

    private func addWelcomeMessage() {
        let welcome = DisplayMessage(
            role: .assistant,
            content: "Hi! I'm your personal style assistant. I can help you with outfit recommendations, style advice, and making the most of your wardrobe. What would you like help with today?",
            quickActions: [
                QuickAction(label: "Today's Weather Picks", action: "weather_outfit"),
                QuickAction(label: "Outfit for Event", action: "occasion_outfit"),
                QuickAction(label: "Style Tips", action: "style_tips"),
                QuickAction(label: "Wardrobe Stats", action: "wardrobe_stats")
            ]
        )
        messages.append(welcome)
    }

    func sendMessage() async {
        guard !inputText.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty else { return }

        let userMessage = inputText
        inputText = ""

        // Add user message
        messages.append(DisplayMessage(role: .user, content: userMessage))

        isLoading = true

        do {
            let response = try await APIService.shared.sendChatMessage(
                message: userMessage,
                conversationId: conversationId
            )

            conversationId = response.conversationId

            // Add assistant response
            messages.append(DisplayMessage(
                role: .assistant,
                content: response.message,
                quickActions: response.quickActions
            ))
        } catch {
            messages.append(DisplayMessage(
                role: .assistant,
                content: "Sorry, I couldn't process your request. Please try again."
            ))
        }

        isLoading = false
    }

    func handleQuickAction(_ action: String) async {
        let actionMessages: [String: String] = [
            "weather_outfit": "What should I wear based on today's weather?",
            "occasion_outfit": "I need an outfit for an event",
            "style_tips": "Give me some style tips",
            "wardrobe_stats": "Tell me about my wardrobe",
            "add_item": "I want to add a new item to my wardrobe",
            "show_outfits": "Show me some outfit ideas",
            "analyze_style": "Analyze my style preferences"
        ]

        if let message = actionMessages[action] {
            inputText = message
            await sendMessage()
        }
    }

    func loadConversations() async {
        do {
            conversations = try await APIService.shared.getConversations()
        } catch {
            print("Failed to load conversations: \(error)")
        }
    }

    func loadConversation(_ id: String) async {
        conversationId = id
        messages = []

        do {
            let chatMessages = try await APIService.shared.getConversation(id: id)
            messages = chatMessages.map { DisplayMessage(from: $0) }
        } catch {
            addWelcomeMessage()
        }
    }

    func startNewConversation() {
        conversationId = nil
        messages = []
        addWelcomeMessage()
    }
}
