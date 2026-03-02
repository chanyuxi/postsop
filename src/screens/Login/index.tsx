import { View } from 'react-native'

import { BackgroundView } from '@/components/common/BackgroundView'
import { Button } from '@/components/common/Button'

export function LoginScreen() {
  return (
    <BackgroundView contentClassName="p-8 items-center justify-center">
      <View className="w-full gap-4">
        <Button block>Sign in</Button>
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
