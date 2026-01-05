export declare class SocialAuthDto {
    provider: 'google' | 'apple';
    token: string;
    email: string;
    name?: string;
    providerId: string;
}
