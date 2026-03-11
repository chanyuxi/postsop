import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Text, View } from 'react-native'
import { z } from 'zod'

import { Button, Icons, ScreenWrapper, ThemeText } from '@/components/common'
import { Form } from '@/components/form/Form'
import { Input } from '@/components/form/Input'
import { APP_VERSION } from '@/constants'
import { useAuth, useToast } from '@/hooks'

interface LoginFormState {
  email: string
  password: string
}

const loginSchema = z.object({
  email: z.email('Invalid email address'),
  password: z
    .string('Password is required')
    .min(8, { error: 'Password must be at least 8 characters long' }),
})

export function SignInScreen() {
  const { toast } = useToast()

  const { signIn } = useAuth()

  const loginForm = useForm<LoginFormState>({
    defaultValues: { email: 'todo@example.com', password: '12345678' },
    resolver: zodResolver(loginSchema),
  })

  const handleSignIn = loginForm.handleSubmit((data) => {
    if (data.email === 'todo@example.com' && data.password === '12345678') {
      signIn()
      toast('Sign in successful')
    } else {
      toast('Invalid credentials')
    }
  })

  return (
    <ScreenWrapper contentClassName="p-8 items-center justify-center">
      <View className="w-full">
        <View className="mb-8">
          <ThemeText className="text-3xl font-bold uppercase italic">
            Todo
          </ThemeText>
          <ThemeText className="text-brand-secondary text-base">
            Make your life well-organized
          </ThemeText>
        </View>

        <Form
          className="mb-4 gap-4"
          form={loginForm}
        >
          <Form.Item name="email">
            <Input
              className="shadow-xs"
              placeholder="Type your email..."
              prefix={
                <Icons
                  name="email-outline"
                  size={24}
                />
              }
            />
          </Form.Item>

          <Form.Item name="password">
            <Input
              secureTextEntry
              className="shadow-xs"
              placeholder="Type your password..."
              prefix={
                <Icons
                  name="key-outline"
                  size={24}
                />
              }
            />
          </Form.Item>
        </Form>

        <View className="mb-8 gap-4">
          <Button onPress={handleSignIn}>Sign in</Button>
          <Button variant="secondary">Sign in with Github</Button>
        </View>

        <View className="flex-row justify-end gap-2">
          <ThemeText className="text-brand-secondary">
            Don't have an account?
          </ThemeText>
          <ThemeText className="text-brand-primary italic underline">
            Create account
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
