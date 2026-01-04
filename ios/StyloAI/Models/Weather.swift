import Foundation

struct WeatherData: Codable {
    let temperature: Int
    let feelsLike: Int
    let humidity: Int
    let description: String
    let icon: String
    let windSpeed: Int
    let city: String
    let country: String

    enum CodingKeys: String, CodingKey {
        case temperature
        case feelsLike = "feels_like"
        case humidity, description, icon
        case windSpeed = "wind_speed"
        case city, country
    }

    var temperatureDisplay: String {
        "\(temperature)°F"
    }

    var feelsLikeDisplay: String {
        "Feels like \(feelsLike)°F"
    }

    var iconSystemName: String {
        switch icon {
        case "01d": return "sun.max.fill"
        case "01n": return "moon.fill"
        case "02d", "02n": return "cloud.sun.fill"
        case "03d", "03n": return "cloud.fill"
        case "04d", "04n": return "smoke.fill"
        case "09d", "09n": return "cloud.drizzle.fill"
        case "10d", "10n": return "cloud.rain.fill"
        case "11d", "11n": return "cloud.bolt.fill"
        case "13d", "13n": return "snow"
        case "50d", "50n": return "cloud.fog.fill"
        default: return "cloud.fill"
        }
    }
}

struct WeatherRecommendations: Codable {
    let layers: [String]
    let accessories: [String]
    let materials: [String]
    let avoid: [String]
}

struct WeatherResponse: Codable {
    let weather: WeatherData
    let recommendations: WeatherRecommendations
}

struct ForecastData: Codable {
    let date: Date
    let temperature: TemperatureRange
    let description: String
    let icon: String
    let precipitation: Int

    struct TemperatureRange: Codable {
        let min: Int
        let max: Int
    }
}
