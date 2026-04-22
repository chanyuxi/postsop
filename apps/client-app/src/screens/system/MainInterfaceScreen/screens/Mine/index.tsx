import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { View } from 'react-native'

import { ScreenWrapper } from '@/components/common/ScreenWrapper'
import { ThemeText } from '@/components/common/ThemeText'
import { VersionIndication } from '@/components/widget/VersionIndication'
import type { AllStackParamList } from '@/routes/type'
import { useProfileQuery } from '@/services/user/queries'

import { Cell } from './components/Cell'
import { CellGroup } from './components/CellGroup'

export function Mine({
  navigation,
}: BottomTabScreenProps<AllStackParamList, 'Mine'>) {
  const profileQuery = useProfileQuery()
  const nickname = profileQuery.data?.nickname?.trim() || 'My Account'
  const profileHint =
    profileQuery.data?.bio?.trim() ||
    'Profile loads separately from the auth session now.'

  const handleSettingPress = () => {
    navigation.navigate('Setting')
  }

  return (
    <ScreenWrapper
      contentClassName="gap-4"
      statusBarClassName="bg-background-secondary"
    >
      <View className="bg-background-secondary">
        <View className="p-8">
          <ThemeText className="mb-2 text-4xl">{nickname}</ThemeText>
          <ThemeText className="text-foreground-secondary">
            {profileHint}
          </ThemeText>
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

      <VersionIndication className="flex-1 justify-end p-8" />
    </ScreenWrapper>
  )
}
