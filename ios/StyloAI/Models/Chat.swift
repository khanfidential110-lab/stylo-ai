import Foundation

enum MessageRole: String, Codable {
    case user = "user"
    case assistant = "assistant"
    case system = "system"
}

struct MessageAttachment: Codable {
    let type: String
    let url: String?
    let itemId: String?
    let outfitId: String?

    enum CodingKeys: String, CodingKey {
        case type, url
        case itemId = "item_id"
        case outfitId = "outfit_id"
    }
}

struct ChatMessage: Codable, Identifiable {
    let id: String
    let userId: String
    let conversationId: String
    let role: MessageRole
    let content: String
    let attachments: [MessageAttachment]?
    let createdAt: Date

    enum CodingKeys: String, CodingKey {
        case id
        case userId = "user_id"
        case conversationId = "conversation_id"
        case role, content, attachments
        case createdAt = "created_at"
    }
}

struct QuickAction: Codable {
    let label: String
    let action: String
}

struct ChatResponse: Codable {
    let message: String
    let conversationId: String
    let attachments: [MessageAttachment]?
    let quickActions: [QuickAction]?

    enum CodingKeys: String, CodingKey {
        case message
        case conversationId = "conversation_id"
        case attachments
        case quickActions = "quick_actions"
    }
}

struct Conversation: Codable, Identifiable {
    let id: String
    let lastMessage: String
    let messageCount: Int
    let createdAt: Date
    let updatedAt: Date

    enum CodingKeys: String, CodingKey {
        case id
        case lastMessage = "last_message"
        case messageCount = "message_count"
        case createdAt = "created_at"
        case updatedAt = "updated_at"
    }
}

struct SendMessageRequest: Codable {
    let message: String
    let conversationId: String?
    let attachments: [MessageAttachment]?

    enum CodingKeys: String, CodingKey {
        case message
        case conversationId = "conversation_id"
        case attachments
    }
}
