import { Platform } from 'react-native'

import pkg from '@/../package.json'

export const APP_VERSION = pkg.version

export const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1'

export const isAndroidVersionLargerThan35 =
  Platform.OS === 'android' && Platform.Version >= 35
