import { zodResolver } from '@hookform/resolvers/zod'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Pressable, View } from 'react-native'
import { z } from 'zod'

import type { SignUpDto } from '@postsop/contracts/type'

import { requestSignUp } from '@/api/auth'
import { ApiError } from '@/api/error'
import {
  Button,
  Form,
  Icons,
  Input,
  ScreenWrapper,
  ThemeText,
  TopBar,
} from '@/components/common'
import { signUpSchema } from '@/constants/schemas'
import type { AuthStackParamList } from '@/routes/type'
import { toast } from '@/utils/toast'

const signUpFormSchema = signUpSchema
  .extend({
    confirmPassword: z.string().min(6),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (password !== confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      })
    }
  })

type SignUpFormState = z.infer<typeof signUpFormSchema>
type SignUpScreenProps = NativeStackScreenProps<AuthStackParamList, 'SignUp'>

export function SignUpScreen({ navigation }: SignUpScreenProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const signUpForm = useForm<SignUpFormState>({
    defaultValues: {
      confirmPassword: '',
      email: '',
      password: '',
    },
    resolver: zodResolver(signUpFormSchema),
  })

  const handleSignUp = signUpForm.handleSubmit(async (data) => {
    if (isSubmitting) {
      return
    }

    try {
      setIsSubmitting(true)

      const payload: SignUpDto = {
        email: data.email,
        password: data.password,
      }

      await requestSignUp(payload)

      toast('Account created, please sign in')
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'SignIn',
            params: {
              initialEmail: data.email,
            },
          },
        ],
      })
    } catch (error) {
      if (error instanceof ApiError) {
        toast(error.message)
      } else if (error instanceof Error) {
        toast(error.message)
      } else {
        toast('Sign up failed')
      }
    } finally {
      setIsSubmitting(false)
    }
  })

  return (
    <ScreenWrapper statusBarClassName="bg-background-secondary">
      <TopBar title="Create Account" />

      <View className="flex-1 px-8 py-6">
        <View className="mb-8">
          <ThemeText className="mb-1 text-3xl font-bold">
            Join Todo App
          </ThemeText>
          <ThemeText className="text-foreground-secondary uppercase">
            Create an account to start organizing your day
          </ThemeText>
        </View>

        <Form
          className="mb-4 gap-4"
          form={signUpForm}
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
              placeholder="Create a password"
              prefix={<Icons name="lock-outline" />}
              secureTextEntry
            />
          </Form.Item>

          <Form.Item name="confirmPassword">
            <Input
              className="shadow-xs"
              editable={!isSubmitting}
              placeholder="Confirm your password"
              prefix={<Icons name="lock-check-outline" />}
              secureTextEntry
            />
          </Form.Item>
        </Form>

        <View className="mb-8 gap-4">
          <Button
            disabled={isSubmitting}
            onPress={handleSignUp}
          >
            {isSubmitting ? 'Creating account...' : 'Create account'}
          </Button>
          <Button
            disabled={isSubmitting}
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
            disabled={isSubmitting}
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
