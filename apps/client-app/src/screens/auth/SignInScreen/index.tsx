import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Pressable, Text, View } from 'react-native'

import {
  Button,
  Form,
  Icons,
  Input,
  ScreenWrapper,
  ThemeText,
} from '@/components/common'
import { APP_VERSION } from '@/constants'
import type { AuthStackParamList } from '@/routes/type'

import { useSignIn } from './hooks/useSignIn'

export function SignInScreen({
  navigation,
}: NativeStackScreenProps<AuthStackParamList, 'SignIn'>) {
  const { loginForm, handleSignIn, isSignIning } = useSignIn()

  const signInFormRender = (
    <Form
      className="mb-6 gap-6"
      form={loginForm}
    >
      <Form.Item name="email">
        <Input
          className="shadow-xs"
          editable={!isSignIning}
          placeholder="Type your email here"
          prefix={<Icons name="alpha-e-box-outline" />}
        />
      </Form.Item>

      <Form.Item name="password">
        <Input
          className="shadow-xs"
          editable={!isSignIning}
          placeholder="Type your password here"
          prefix={<Icons name="alpha-p-box-outline" />}
          secureTextEntry
        />
      </Form.Item>
    </Form>
  )

  return (
    <ScreenWrapper contentClassName="p-8 items-center justify-center">
      <View className="w-full">
        {signInFormRender}

        <View className="mb-8 gap-6">
          <Button
            disabled={isSignIning}
            onPress={handleSignIn}
          >
            {isSignIning ? 'Signing in...' : 'Sign in'}
          </Button>
          <Button
            disabled={isSignIning}
            variant="secondary"
          >
            Sign in with Github
          </Button>
        </View>

        <View className="flex-row justify-end gap-2">
          <ThemeText className="text-foreground-secondary text-sm">
            Don&apos;t have an account?
          </ThemeText>
          <Pressable
            disabled={isSignIning}
            onPress={() => navigation.navigate('SignUp')}
          >
            <ThemeText className="text-brand-primary text-sm italic underline">
              Create
            </ThemeText>
          </Pressable>
        </View>
      </View>

      <View className="absolute right-0 bottom-0  p-8 left-0">
        <Text className="text-black.10 text-center text-black/10 italic dark:text-white/10">
          Version {APP_VERSION}
        </Text>
      </View>
    </ScreenWrapper>
  )
}
