declare const _default: () => {
    port: number;
    nodeEnv: string;
    database: {
        host: string;
        port: number;
        username: string;
        password: string;
        name: string;
    };
    redis: {
        host: string;
        port: number;
        password: string;
    };
    jwt: {
        secret: string;
        accessExpiration: string;
        refreshExpiration: string;
    };
    google: {
        clientId: string;
        clientSecret: string;
        callbackUrl: string;
    };
    apple: {
        clientId: string;
        teamId: string;
        keyId: string;
        privateKey: string;
    };
    weather: {
        apiKey: string;
        baseUrl: string;
    };
    ai: {
        openrouterKey: string;
        groqKey: string;
        openaiKey: string;
        anthropicKey: string;
    };
    stripe: {
        secretKey: string;
        webhookSecret: string;
        premiumPriceId: string;
        premiumPlusPriceId: string;
    };
    aws: {
        accessKeyId: string;
        secretAccessKey: string;
        region: string;
        s3Bucket: string;
    };
    cdn: {
        url: string;
    };
    limits: {
        free: {
            wardrobeItems: number;
            dailySuggestions: number;
            dailyChatMessages: number;
            dailyAnalyses: number;
        };
        premium: {
            wardrobeItems: number;
            dailySuggestions: number;
            dailyChatMessages: number;
            dailyAnalyses: number;
        };
        premiumPlus: {
            wardrobeItems: number;
            dailySuggestions: number;
            dailyChatMessages: number;
            dailyAnalyses: number;
        };
    };
};
export default _default;
