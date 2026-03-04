import { Text, View } from 'react-native'

import { Button } from '@/components/common/Button'
import { ScreenWrapper } from '@/components/common/ScreenWrapper'
import { APP_VERSION } from '@/constants'
import { useAuth } from '@/hooks/useAuth'

export function SignInScreen() {
  const { signIn } = useAuth()

  return (
    <ScreenWrapper contentClassName="p-8 items-center justify-center">
      <View className="w-full gap-4">
        <Button onPress={signIn}>Sign in</Button>
        <Button variant="secondary">Create new account</Button>
      </View>

      <View className="absolute right-0 bottom-0 left-0 p-8">
        <Text className="text-black.10 text-center text-black/10 italic dark:text-white/10">
          Version {APP_VERSION}
        </Text>
      </View>
    </ScreenWrapper>
  )
}
