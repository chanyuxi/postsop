export const authKey = {
  signIn: () => ['auth', 'sign-in'] as const,
  signOut: () => ['auth', 'sign-out'] as const,
  signUp: () => ['auth', 'sign-up'] as const,
}
