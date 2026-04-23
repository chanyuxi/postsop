import { MaterialDesignIcons } from '@react-native-vector-icons/material-design-icons'
import { View } from 'react-native'
import { useCSSVariable } from 'uniwind'

import { Button } from '@/components/common'
import { ScreenWrapper } from '@/components/common/screen-wrapper'
import { TopBar } from '@/components/common/top-bar'
import { ThemeToggle } from '@/components/widget/theme-toggle'
import { APP_VERSION } from '@/constants'
import { useAuth } from '@/hooks'
import { toast } from '@/libs/toast'

import { ConfigItem } from './components/config-item'

export function SettingScreen() {
  const { isSignOuting, signOut } = useAuth()
  const foregroundColor = useCSSVariable('--color-foreground') as string

  return (
    <ScreenWrapper statusBarClassName="bg-background-secondary">
      <TopBar title="SETTING" />

      <View className="flex-1 gap-4 p-4">
        <ConfigItem
          description="set your favorite theme"
          label="Theme"
          value={<ThemeToggle />}
        />

        <ConfigItem
          description="switching regional languages"
          label="Language"
          value="En"
        />

        <ConfigItem
          description="no longer accepting new messagess"
          label="Do Not Disturb"
          value="Off"
        />

        <ConfigItem
          description="submit your question to us"
          label="Help and Feedback"
          value={
            <MaterialDesignIcons
              color={foregroundColor}
              name="chevron-right"
            />
          }
        />

        <ConfigItem
          description="check for updates"
          label="Version"
          value={APP_VERSION}
          onPress={() => toast('No updates available')}
        />

        <Button
          disabled={isSignOuting}
          variant="danger"
          onPress={() => void signOut()}
        >
          Sign out
        </Button>
      </View>
    </ScreenWrapper>
  )
}
