import { Platform } from 'react-native'

import pkg from '@/../package.json'

export const APP_VERSION = pkg.version

export const PERSISTENCE_KEY = 'NAVIGATION_STATE_V1'

export const IS_ANDROID_AND_VERSION_LARGER_THAN_OR_EQUAL_TO_35 =
  Platform.OS === 'android' && Platform.Version >= 35
