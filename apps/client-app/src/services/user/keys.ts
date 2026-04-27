export const userKey = {
  profile: () => ['user', 'profile'] as const,
  profileStatus: () => ['user', 'profile', 'status'] as const,
}
