import Foundation
import Security

class KeychainHelper {
    static let shared = KeychainHelper()
    private let service = "com.styloai.app"

    private init() {}

    // MARK: - Token Management

    func saveTokens(_ tokens: AuthTokens) {
        save(key: "accessToken", data: tokens.accessToken.data(using: .utf8)!)
        save(key: "refreshToken", data: tokens.refreshToken.data(using: .utf8)!)
    }

    func getAccessToken() -> String? {
        guard let data = load(key: "accessToken") else { return nil }
        return String(data: data, encoding: .utf8)
    }

    func getRefreshToken() -> String? {
        guard let data = load(key: "refreshToken") else { return nil }
        return String(data: data, encoding: .utf8)
    }

    func clearTokens() {
        delete(key: "accessToken")
        delete(key: "refreshToken")
    }

    // MARK: - Private Methods

    private func save(key: String, data: Data) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
            kSecValueData as String: data,
            kSecAttrAccessible as String: kSecAttrAccessibleWhenUnlockedThisDeviceOnly
        ]

        // Delete existing item
        SecItemDelete(query as CFDictionary)

        // Add new item
        let status = SecItemAdd(query as CFDictionary, nil)
        if status != errSecSuccess {
            print("Keychain save failed: \(status)")
        }
    }

    private func load(key: String) -> Data? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]

        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)

        if status == errSecSuccess {
            return result as? Data
        }
        return nil
    }

    private func delete(key: String) {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: key
        ]

        SecItemDelete(query as CFDictionary)
    }
}
