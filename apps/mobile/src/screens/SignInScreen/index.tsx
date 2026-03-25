import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Text, View } from 'react-native'

import {
  Button,
  Form,
  Icons,
  Input,
  ScreenWrapper,
  ThemeText,
} from '@/components/common'
import { APP_VERSION } from '@/constants'
import { type LoginFormState, loginSchema } from '@/constants/schemas'
import { useAuth } from '@/hooks'
import { storage, StrorageKeys } from '@/utils/storage'
import { toast } from '@/utils/toast'

export function SignInScreen() {
  const { signIn } = useAuth()

  const loginForm = useForm<LoginFormState>({
    defaultValues: { email: 'hello@example.com', password: '123456' },
    resolver: zodResolver(loginSchema),
  })

  const handleSignIn = loginForm.handleSubmit((data) => {
    if (data.email === 'hello@example.com' && data.password === '123456') {
      signIn({
        id: 1,
        email: data.email,
        roles: [{ name: 'member' }],
      })
      const token = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
      console.log('sign in with token:', token)
      storage.set(StrorageKeys.TOKEN, token)
    } else {
      toast('Invalid credentials')
    }
  })

  const loginFormRender = (
    <Form
      className="mb-4 gap-4"
      form={loginForm}
    >
      <Form.Item name="email">
        <Input
          className="shadow-xs"
          placeholder="Type your email here"
          prefix={<Icons name="alpha-e-box-outline" />}
        />
      </Form.Item>

      <Form.Item name="password">
        <Input
          secureTextEntry
          className="shadow-xs"
          placeholder="Type your password here"
          prefix={<Icons name="alpha-p-box-outline" />}
        />
      </Form.Item>
    </Form>
  )

  return (
    <ScreenWrapper contentClassName="p-8 items-center justify-center">
      <View className="w-full">
        <View className="mb-8">
          <ThemeText className="mb-1 text-3xl font-bold">Todo App</ThemeText>
          <ThemeText className="text-foreground-secondary uppercase">
            Make your life well-organized
          </ThemeText>
        </View>

        {loginFormRender}

        <View className="mb-8 gap-4">
          <Button onPress={handleSignIn}>Sign in</Button>
          <Button variant="secondary">Sign in with Github</Button>
        </View>

        <View className="flex-row justify-end gap-2">
          <ThemeText className="text-foreground-secondary text-sm">
            Don't have an account?
          </ThemeText>
          <ThemeText className="text-brand-primary text-sm italic underline">
            Create
          </ThemeText>
        </View>
      </View>

      <View className="absolute right-0 bottom-0 left-0 p-8">
        <Text className="text-black.10 text-center text-black/10 italic dark:text-white/10">
          Version {APP_VERSION}
        </Text>
      </View>
    </ScreenWrapper>
  )
}
