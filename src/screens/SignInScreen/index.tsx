import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Text, View } from 'react-native'
import { z } from 'zod'

import { Button } from '@/components/common/Button'
import { ScreenWrapper } from '@/components/common/ScreenWrapper'
import { Form } from '@/components/form/Form'
import { Input } from '@/components/form/Input'
import { APP_VERSION } from '@/constants'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'

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
    resolver: zodResolver(loginSchema),
  })

  const handleSignIn = loginForm.handleSubmit((data) => {
    toast({ message: 'Sign in successful' })

    console.log(data)
    console.log(signIn)
  })

  return (
    <ScreenWrapper contentClassName="p-8 items-center justify-center">
      <View className="w-full gap-4">
        <Form
          className="gap-4"
          form={loginForm}
        >
          <Form.Item
            name="email"
            label="Email"
          >
            <Input placeholder="Type your email..." />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
          >
            <Input placeholder="Type your password..." />
          </Form.Item>
        </Form>

        <Button onPress={handleSignIn}>Sign in</Button>
        <Button variant="secondary">Create new account</Button>
      </View>

      <View className="absolute right-0 bottom-0 left-0 p-8">
        <Text className="text-black.10 text-center text-black/10 italic dark:text-white/10">
          Version {APP_VERSION}
        </Text>
      </View>
    </ScreenWrapper>
  )
}
