"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RefreshTokenDto = exports.SignUpDto = exports.SignInDto = void 0;
const zod_1 = require("zod");
const EmailSchema = zod_1.z.string().trim().toLowerCase().email();
const PasswordSchema = zod_1.z.string().min(6);
exports.SignInDto = zod_1.z
    .object({
    email: EmailSchema,
    password: PasswordSchema,
})
    .strict();
exports.SignUpDto = zod_1.z
    .object({
    email: EmailSchema,
    password: PasswordSchema,
})
    .strict();
exports.RefreshTokenDto = zod_1.z
    .object({
    refreshToken: zod_1.z
        .string()
        .trim()
        .regex(/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/, 'Invalid refresh token'),
})
    .strict();
//# sourceMappingURL=auth.js.map