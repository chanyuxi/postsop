import { View } from 'react-native'

import { APP_VERSION } from '@/constants'

import { ThemeText } from '../common'

interface VersionIndicationProps {
  className: string
}

export function VersionIndication(props: VersionIndicationProps) {
  return (
    // TODO: Delete the outermost View and let the user control it, so we don't need to configure the className anymore
    <View className={props.className}>
      <ThemeText className="text-center text-xs text-black/20 italic dark:text-white/20">
        Developer ChanYuxi · Version {APP_VERSION}
      </ThemeText>
    </View>
  )
}
