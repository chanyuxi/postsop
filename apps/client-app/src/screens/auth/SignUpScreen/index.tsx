import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Pressable, View } from 'react-native'

import {
  Button,
  Form,
  Icons,
  Input,
  ScreenWrapper,
  ThemeText,
} from '@/components/common'
import type { AuthStackParamList } from '@/routes/type'

import { useSignUp } from './hooks/useSignUp'

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

  const signUpFormRender = (
    <Form
      className="mb-6 gap-6"
      form={signUpForm}
    >
      <Form.Item name="email">
        <Input
          className="shadow-xs"
          editable={!isRegistering}
          placeholder="Type your email here"
          prefix={<Icons name="alpha-e-box-outline" />}
        />
      </Form.Item>

      <Form.Item name="password">
        <Input
          className="shadow-xs"
          editable={!isRegistering}
          placeholder="Create a password"
          prefix={<Icons name="lock-outline" />}
          secureTextEntry
        />
      </Form.Item>

      <Form.Item name="confirmPassword">
        <Input
          className="shadow-xs"
          editable={!isRegistering}
          placeholder="Confirm your password"
          prefix={<Icons name="lock-check-outline" />}
          secureTextEntry
        />
      </Form.Item>
    </Form>
  )

  return (
    <ScreenWrapper contentClassName="p-8 items-center justify-center">
      <View className="w-full">
        {signUpFormRender}

        <View className="mb-8 gap-6">
          <Button
            disabled={isRegistering}
            onPress={handleSignUp}
          >
            {isRegistering ? 'Creating account...' : 'Create account'}
          </Button>
          <Button
            disabled={isRegistering}
            variant="secondary"
            onPress={() => navigation.goBack()}
          >
            Back to sign in
          </Button>
        </View>

        <View className="flex-row justify-end gap-2">
          <ThemeText className="text-foreground-secondary text-sm">
            Already have an account?
          </ThemeText>
          <Pressable
            disabled={isRegistering}
            onPress={() => navigation.goBack()}
          >
            <ThemeText className="text-brand-primary text-sm italic underline">
              Sign in
            </ThemeText>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  )
}
