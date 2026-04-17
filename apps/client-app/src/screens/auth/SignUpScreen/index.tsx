import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { Pressable, View } from 'react-native'

import {
  Button,
  Form,
  Input,
  PasswordInput,
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
  )

  return (
    <ScreenWrapper
      statusBarClassName="-z-10"
      contentClassName="p-8 items-center justify-center"
    >
      <View className="w-full">
        {signUpFormRender}

        <View className="mb-8 gap-6">
          <Button
            disabled={isRegistering}
            onPress={handleSignUp}
          >
            {isRegistering ? 'Creating account...' : 'Create account'}
          </Button>
        </View>

        <View className="flex-row justify-end gap-2">
          <ThemeText>Already have an account?</ThemeText>
          <Pressable
            disabled={isRegistering}
            onPress={() => navigation.goBack()}
          >
            <ThemeText className="text-brand-primary underline">
              Sign in
            </ThemeText>
          </Pressable>
        </View>
      </View>
    </ScreenWrapper>
  )
}
