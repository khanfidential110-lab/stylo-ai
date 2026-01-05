"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    database: {
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '5432', 10),
        username: process.env.DATABASE_USERNAME || 'stylo',
        password: process.env.DATABASE_PASSWORD || 'password',
        name: process.env.DATABASE_NAME || 'stylo_ai',
    },
    redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379', 10),
        password: process.env.REDIS_PASSWORD || '',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'super-secret-key',
        accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '1h',
        refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '30d',
    },
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackUrl: process.env.GOOGLE_CALLBACK_URL,
    },
    apple: {
        clientId: process.env.APPLE_CLIENT_ID,
        teamId: process.env.APPLE_TEAM_ID,
        keyId: process.env.APPLE_KEY_ID,
        privateKey: process.env.APPLE_PRIVATE_KEY,
    },
    weather: {
        apiKey: process.env.OPENWEATHER_API_KEY || '',
        baseUrl: 'https://api.openweathermap.org/data/2.5',
    },
    ai: {
        openrouterKey: process.env.OPENROUTER_API_KEY || '',
        groqKey: process.env.GROQ_API_KEY || '',
        openaiKey: process.env.OPENAI_API_KEY,
        anthropicKey: process.env.ANTHROPIC_API_KEY,
    },
    stripe: {
        secretKey: process.env.STRIPE_SECRET_KEY,
        webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
        premiumPriceId: process.env.STRIPE_PREMIUM_PRICE_ID,
        premiumPlusPriceId: process.env.STRIPE_PREMIUM_PLUS_PRICE_ID,
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION || 'us-east-1',
        s3Bucket: process.env.AWS_S3_BUCKET || 'stylo-ai-uploads',
    },
    cdn: {
        url: process.env.CDN_URL || 'https://cdn.stylo-ai.com',
    },
    limits: {
        free: {
            wardrobeItems: 50,
            dailySuggestions: 3,
            dailyChatMessages: 5,
            dailyAnalyses: 3,
        },
        premium: {
            wardrobeItems: -1,
            dailySuggestions: -1,
            dailyChatMessages: 100,
            dailyAnalyses: -1,
        },
        premiumPlus: {
            wardrobeItems: -1,
            dailySuggestions: -1,
            dailyChatMessages: -1,
            dailyAnalyses: -1,
        },
    },
});
//# sourceMappingURL=configuration.js.map