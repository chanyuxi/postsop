import { z } from 'zod';
export declare const SignInDto: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strict>;
export type SignInDto = z.infer<typeof SignInDto>;
export declare const SignUpDto: z.ZodObject<{
    email: z.ZodString;
    password: z.ZodString;
}, z.core.$strict>;
export type SignUpDto = z.infer<typeof SignUpDto>;
export declare const RefreshTokenDto: z.ZodObject<{
    refreshToken: z.ZodString;
}, z.core.$strict>;
export type RefreshTokenDto = z.infer<typeof RefreshTokenDto>;
export interface RoleSummary {
    name: string;
}
export interface SessionUser {
    id: number;
    email: string;
    roles: RoleSummary[];
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export interface SignInResult {
    tokens: AuthTokens;
    user: SessionUser;
}
export type RefreshTokenResult = AuthTokens;
