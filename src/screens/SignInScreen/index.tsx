import { View } from 'react-native'

import { BackgroundView } from '@/components/common/BackgroundView'
import { Button } from '@/components/common/Button'
import { useAuth } from '@/hooks/useAuth'

export function SignInScreen() {
  const { signIn } = useAuth()

  return (
    <BackgroundView contentClassName="p-8 items-center justify-center">
      <View className="w-full gap-4">
        <Button
          block
          onPress={signIn}
        >
          Sign in
        </Button>
        <Button
          block
          variant="secondary"
        >
          Create new account
        </Button>
      </View>
    </BackgroundView>
  )
}
