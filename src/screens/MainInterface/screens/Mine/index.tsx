import { Text, View } from 'react-native'

import { BackgroundView } from '@/components/common/BackgroundView'
import { StatusBarPlaceholder } from '@/components/common/StatusBarPlaceholder'
import { APP_VERSION } from '@/constants'
import { useAuth } from '@/contexts/auth'

import { Cell } from './components/Cell'
import { CellGroup } from './components/CellGroup'

export function Mine() {
  const { user } = useAuth()

  return (
    <BackgroundView className="gap-4">
      <View className="bg-background-light">
        <StatusBarPlaceholder />

        <View className="p-8">
          <Text className="text-foreground mb-2 text-4xl">{user?.name}</Text>
          <Text className="text-foreground-secondary">{user?.signature}</Text>
        </View>
      </View>

      <CellGroup className="bg-background-light">
        <Cell label="Profile" />
        <Cell label="Premium" />
        <Cell label="Communities" />
      </CellGroup>

      <CellGroup className="bg-background-light">
        <Cell label="Setting" />
      </CellGroup>

      <View className="flex-1 justify-end p-8">
        <Text className="text-center text-xs text-white/10">
          Version {APP_VERSION}
        </Text>
      </View>
    </BackgroundView>
  )
}
