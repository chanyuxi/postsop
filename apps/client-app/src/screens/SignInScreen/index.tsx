import { zodResolver } from '@hookform/resolvers/zod'
import { type NativeStackScreenProps } from '@react-navigation/native-stack'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Pressable, Text, View } from 'react-native'

import { requestSignIn } from '@/api/auth'
import { ApiError } from '@/api/error'
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
import { type AuthStackParamList } from '@/routes/type'
import { toast } from '@/utils/toast'

type SignInScreenProps = NativeStackScreenProps<AuthStackParamList, 'SignIn'>

export function SignInScreen({ navigation, route }: SignInScreenProps) {
  const { signIn } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const loginForm = useForm<LoginFormState>({
    defaultValues: {
      email: route.params?.initialEmail ?? 'admin@example.com',
      password: 'password',
    },
    resolver: zodResolver(loginSchema),
  })

  const handleSignIn = loginForm.handleSubmit(async (data) => {
    if (isSubmitting) {
      return
    }

    try {
      setIsSubmitting(true)

      const response = await requestSignIn(data)

      if (!response.data) {
        throw new Error('Sign-in response is missing session data')
      }

      signIn(response.data)
      toast('Sign in successful')
    } catch (error) {
      if (error instanceof ApiError) {
        toast(error.message)
      } else if (error instanceof Error) {
        toast(error.message)
      } else {
        toast('Sign in failed')
      }
    } finally {
      setIsSubmitting(false)
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
          editable={!isSubmitting}
          placeholder="Type your email here"
          prefix={<Icons name="alpha-e-box-outline" />}
        />
      </Form.Item>

      <Form.Item name="password">
        <Input
          className="shadow-xs"
          editable={!isSubmitting}
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
        <View className="mb-8">
          <ThemeText className="mb-1 text-3xl font-bold">Todo App</ThemeText>
          <ThemeText className="text-foreground-secondary uppercase">
            Make your life well-organized
          </ThemeText>
        </View>

        {loginFormRender}

        <View className="mb-8 gap-4">
          <Button
            disabled={isSubmitting}
            onPress={handleSignIn}
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
          <Button
            disabled={isSubmitting}
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
            disabled={isSubmitting}
            onPress={() => navigation.navigate('SignUp')}
          >
            <ThemeText className="text-brand-primary text-sm italic underline">
              Create
            </ThemeText>
          </Pressable>
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
