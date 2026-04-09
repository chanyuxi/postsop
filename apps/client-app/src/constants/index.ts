import { Platform } from 'react-native'

import pkg from '@/../package.json'

/** Application version */
export const APP_VERSION = pkg.version

/** Check if the device is Android and the version is larger than or equal to 35 */
export const IS_ANDROID_AND_VERSION_LARGER_THAN_OR_EQUAL_TO_35 =
  Platform.OS === 'android' && Platform.Version >= 35
