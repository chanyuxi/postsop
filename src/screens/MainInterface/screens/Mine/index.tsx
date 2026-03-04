import { type BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { Text, View } from 'react-native'

import { BackgroundView } from '@/components/common/BackgroundView'
import { ThemeText } from '@/components/common/ThemeText'
import { APP_VERSION } from '@/constants'
import { useAuth } from '@/hooks/useAuth'
import { type AllStackParamList } from '@/routes/type'

import { Cell } from './components/Cell'
import { CellGroup } from './components/CellGroup'

export function Mine({
  navigation,
}: BottomTabScreenProps<AllStackParamList, 'Mine'>) {
  const { user } = useAuth()

  const handleSettingPress = () => {
    navigation.navigate('Setting')
  }

  return (
    <BackgroundView
      contentClassName="gap-4"
      statusBarClassName="bg-background-secondary"
    >
      <View className="bg-background-secondary">
        <View className="p-8">
          <ThemeText className="mb-2 text-4xl">{user?.name}</ThemeText>
          <Text className="text-foreground-secondary"> {user?.signature}</Text>
        </View>
      </View>

      <CellGroup className="bg-background-secondary">
        <Cell label="Profile" />
        <Cell label="Premium" />
        <Cell label="Communities" />
      </CellGroup>

      <CellGroup className="bg-background-secondary">
        <Cell
          label="Setting"
          onPress={handleSettingPress}
        />
      </CellGroup>

      <View className="flex-1 justify-end p-8">
        <Text className="text-center text-xs text-white/10">
          Version {APP_VERSION}
        </Text>
      </View>
    </BackgroundView>
  )
}
