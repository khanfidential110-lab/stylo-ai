import SwiftUI

struct ChatView: View {
    @StateObject private var viewModel = ChatViewModel()

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Messages
                ScrollViewReader { proxy in
                    ScrollView {
                        LazyVStack(spacing: 16) {
                            ForEach(viewModel.messages) { message in
                                MessageBubble(message: message, onQuickAction: { action in
                                    Task {
                                        await viewModel.handleQuickAction(action)
                                    }
                                })
                                .id(message.id)
                            }

                            if viewModel.isLoading {
                                TypingIndicator()
                            }
                        }
                        .padding()
                    }
                    .onChange(of: viewModel.messages.count) { _, _ in
                        if let lastMessage = viewModel.messages.last {
                            withAnimation {
                                proxy.scrollTo(lastMessage.id, anchor: .bottom)
                            }
                        }
                    }
                }

                Divider()

                // Input
                ChatInputBar(text: $viewModel.inputText, isLoading: viewModel.isLoading) {
                    Task {
                        await viewModel.sendMessage()
                    }
                }
            }
            .navigationTitle("Style Assistant")
            .toolbar {
                ToolbarItem(placement: .primaryAction) {
                    Menu {
                        Button {
                            viewModel.startNewConversation()
                        } label: {
                            Label("New Chat", systemImage: "plus.message")
                        }

                        Button {
                            Task {
                                await viewModel.loadConversations()
                            }
                        } label: {
                            Label("History", systemImage: "clock")
                        }
                    } label: {
                        Image(systemName: "ellipsis.circle")
                    }
                }
            }
        }
    }
}

struct MessageBubble: View {
    let message: DisplayMessage
    let onQuickAction: (String) -> Void

    var isUser: Bool {
        message.role == .user
    }

    var body: some View {
        VStack(alignment: isUser ? .trailing : .leading, spacing: 8) {
            HStack {
                if isUser { Spacer() }

                VStack(alignment: .leading, spacing: 8) {
                    Text(message.content)
                        .padding(12)
                        .background(isUser ? Color.brandIndigo : Color.gray100)
                        .foregroundColor(isUser ? .white : .primary)
                        .cornerRadius(16)

                    // Quick actions
                    if let quickActions = message.quickActions, !quickActions.isEmpty {
                        FlowLayout(spacing: 8) {
                            ForEach(quickActions, id: \.action) { action in
                                Button(action.label) {
                                    onQuickAction(action.action)
                                }
                                .font(.caption)
                                .padding(.horizontal, 12)
                                .padding(.vertical, 8)
                                .background(Color.brandIndigo.opacity(0.1))
                                .foregroundColor(.brandIndigo)
                                .cornerRadius(16)
                            }
                        }
                    }
                }
                .frame(maxWidth: 280, alignment: isUser ? .trailing : .leading)

                if !isUser { Spacer() }
            }

            // Timestamp
            Text(message.timestamp.formatted(date: .omitted, time: .shortened))
                .font(.caption2)
                .foregroundColor(.secondary)
        }
    }
}

struct TypingIndicator: View {
    @State private var animating = false

    var body: some View {
        HStack(spacing: 4) {
            ForEach(0..<3) { index in
                Circle()
                    .fill(Color.gray300)
                    .frame(width: 8, height: 8)
                    .scaleEffect(animating ? 1.0 : 0.5)
                    .animation(
                        Animation.easeInOut(duration: 0.6)
                            .repeatForever()
                            .delay(Double(index) * 0.2),
                        value: animating
                    )
            }
        }
        .padding(12)
        .background(Color.gray100)
        .cornerRadius(16)
        .frame(maxWidth: .infinity, alignment: .leading)
        .onAppear {
            animating = true
        }
    }
}

struct ChatInputBar: View {
    @Binding var text: String
    let isLoading: Bool
    let onSend: () -> Void

    var body: some View {
        HStack(spacing: 12) {
            // Attachment button
            Button {
                // Show attachment options
            } label: {
                Image(systemName: "photo")
                    .font(.title3)
                    .foregroundColor(.secondary)
            }

            // Text field
            TextField("Ask me anything...", text: $text, axis: .vertical)
                .textFieldStyle(.plain)
                .lineLimit(1...5)
                .padding(10)
                .background(Color.gray100)
                .cornerRadius(20)

            // Send button
            Button(action: onSend) {
                Image(systemName: "arrow.up.circle.fill")
                    .font(.title)
                    .foregroundColor(text.isEmpty || isLoading ? .gray300 : .brandIndigo)
            }
            .disabled(text.isEmpty || isLoading)
        }
        .padding(.horizontal)
        .padding(.vertical, 8)
        .background(Color.white)
    }
}

#Preview {
    ChatView()
}
