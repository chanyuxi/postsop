import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Pressable, View } from 'react-native'
import Animated, { FadeInDown } from 'react-native-reanimated'

import {
  Button,
  Form,
  Input,
  PasswordInput,
  ThemeText,
  useStatusBarHeight,
} from '@/components/common'
import { VersionIndication } from '@/components/widget/VersionIndication'
import type { AuthStackParamList } from '@/routes/type'

import { SignInDecorations } from './components'
import { useSignIn } from './hooks/useSignIn'

export function SignInScreen({
  navigation,
}: NativeStackScreenProps<AuthStackParamList, 'SignIn'>) {
  const statusBarHeight = useStatusBarHeight()

  const { loginForm, handleSignIn, isSignIning } = useSignIn()

  return (
    <View className="bg-background-secondary flex-1">
      <SignInDecorations />

      <View
        className="relative flex-1 items-center justify-center overflow-hidden p-8"
        style={{ marginTop: statusBarHeight }}
      >
        <Animated.View className="absolute top-0 left-0 p-8">
          <ThemeText className="text-4xl">Postsop</ThemeText>
        </Animated.View>

        <Animated.View
          className="w-full"
          entering={FadeInDown.duration(650)}
        >
          <Form
            className="mb-6 gap-6"
            form={loginForm}
          >
            <Form.Item name="email">
              <Input
                className="shadow-xs"
                editable={!isSignIning}
                placeholder="Type your email here"
                variant="hollowed-out"
              />
            </Form.Item>

            <Form.Item name="password">
              <PasswordInput
                className="shadow-xs"
                editable={!isSignIning}
                placeholder="Type your password here"
                variant="hollowed-out"
              />
            </Form.Item>
          </Form>

          <View className="mb-8 gap-6">
            <Button
              disabled={isSignIning}
              onPress={handleSignIn}
            >
              {isSignIning ? 'Signing in...' : 'Sign in'}
            </Button>
          </View>

          <View className="flex-row justify-end gap-2">
            <ThemeText>Don&apos;t have an account?</ThemeText>
            <Pressable
              disabled={isSignIning}
              onPress={() => navigation.navigate('SignUp')}
            >
              <ThemeText className="text-brand-primary italic underline">
                Create
              </ThemeText>
            </Pressable>
          </View>
        </Animated.View>

        <VersionIndication className="absolute right-0 bottom-0 left-0 p-8" />
      </View>
    </View>
  )
}
