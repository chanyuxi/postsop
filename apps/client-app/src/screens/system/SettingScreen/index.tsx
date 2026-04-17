import { View } from 'react-native'

import { Button, Icons } from '@/components/common'
import { ScreenWrapper } from '@/components/common/ScreenWrapper'
import { TopBar } from '@/components/common/TopBar'
import { ThemeToggle } from '@/components/widget/ThemeToggle'
import { APP_VERSION } from '@/constants'
import { useAuth } from '@/hooks'
import { toast } from '@/libs/toast'

import { ConfigItem } from './components/ConfigItem'

export function SettingScreen() {
  const { signOut } = useAuth()

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
          value={<Icons name="chevron-right" />}
        />

        <ConfigItem
          description="check for updates"
          label="Version"
          value={APP_VERSION}
          onPress={() => toast('No updates available')}
        />

        <Button
          variant="danger"
          onPress={signOut}
        >
          Sign out
        </Button>
      </View>
    </ScreenWrapper>
  )
}
