import { createMMKV } from 'react-native-mmkv'

import { STRORAGE_KEY_THEME } from '@/constants'

export const StrorageKeys = {
  THEME: STRORAGE_KEY_THEME,
}

export const storage = createMMKV()
