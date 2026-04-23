import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Pressable, View } from 'react-native'
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated'

import {
  Button,
  Form,
  Input,
  PasswordInput,
  ScreenWrapper,
  ThemeText,
} from '@/components/common'
import { ThemeToggle } from '@/components/widget/theme-toggle'
import type { AuthStackParamList } from '@/routes/type'

import { useSignUp } from './hooks/use-sign-up'

export function SignUpScreen({
  navigation,
}: NativeStackScreenProps<AuthStackParamList, 'SignUp'>) {
  const { signUpForm, handleSignUp, isRegistering } = useSignUp({
    successCallback: () => {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'SignIn',
          },
        ],
      })
    },
  })

  return (
    <ScreenWrapper
      className="bg-background-secondary"
      contentClassName="relative justify-center p-8"
    >
      <View className="absolute top-0 right-0 left-0 flex-row items-center justify-between p-8">
        <Animated.View entering={FadeInRight.duration(420).delay(60)}>
          <ThemeToggle />
        </Animated.View>
      </View>

      <View className="w-full">
        <Animated.View
          className="mb-8 gap-2"
          entering={FadeInLeft.duration(460).delay(80)}
        >
          <ThemeText className="text-4xl">Create your account</ThemeText>
          <ThemeText className="text-foreground-secondary">
            A few details and you&apos;re ready to start.
          </ThemeText>
        </Animated.View>

        <Form
          className="mb-6 gap-6"
          form={signUpForm}
        >
          <Form.Item name="email">
            <Input
              variant="hollowed-out"
              className="shadow-xs"
              editable={!isRegistering}
              placeholder="Type your email here"
            />
          </Form.Item>

          <Form.Item name="password">
            <PasswordInput
              variant="hollowed-out"
              className="shadow-xs"
              editable={!isRegistering}
              placeholder="Create a password"
            />
          </Form.Item>

          <Form.Item name="confirmPassword">
            <PasswordInput
              variant="hollowed-out"
              className="shadow-xs"
              editable={!isRegistering}
              placeholder="Confirm your password"
            />
          </Form.Item>
        </Form>

        <Animated.View
          className="mb-8 gap-6"
          entering={FadeInRight.duration(460).delay(220)}
        >
          <Button
            disabled={isRegistering}
            onPress={handleSignUp}
          >
            {isRegistering ? 'Creating account...' : 'Create account'}
          </Button>
        </Animated.View>

        <Animated.View
          className="flex-row justify-end gap-2"
          entering={FadeInLeft.duration(460).delay(280)}
        >
          <ThemeText>Already have an account?</ThemeText>
          <Pressable
            disabled={isRegistering}
            onPress={() => navigation.goBack()}
          >
            <ThemeText className="text-brand-primary underline">
              Sign in
            </ThemeText>
          </Pressable>
        </Animated.View>
      </View>
    </ScreenWrapper>
  )
}
