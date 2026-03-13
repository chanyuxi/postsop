import { View } from 'react-native'

import { Button, Icons } from '@/components/common'
import { ScreenWrapper } from '@/components/common/ScreenWrapper'
import { TopBar } from '@/components/common/TopBar'
import { APP_VERSION } from '@/constants'
import { useAuth, useToast } from '@/hooks'

import { ConfigItem } from './components/ConfigItem'
import { ThemeToggle } from './components/ThemeToggle'

export function SettingScreen() {
  const { signOut } = useAuth()
  const { toast } = useToast()

  return (
    <ScreenWrapper statusBarClassName="bg-background-secondary">
      <TopBar title="SETTING" />

      <View className="flex-1 gap-4 p-4">
        <ThemeToggle />

        <ConfigItem
          label="Language"
          description="switching regional languages"
          value="En"
        />

        <ConfigItem
          label="Do Not Disturb"
          description="no longer accepting new messagess"
          value="Off"
        />

        <ConfigItem
          label="Help and Feedback"
          description="submit your question to us"
          value={<Icons name="chevron-right" />}
        />

        <ConfigItem
          label="Version"
          description="check for updates"
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
