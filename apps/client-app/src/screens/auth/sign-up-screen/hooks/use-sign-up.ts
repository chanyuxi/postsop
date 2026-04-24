import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { password } from '@postsop/contracts'
import type { SignUpRequest } from '@postsop/contracts/auth'
import { SignUpRequestSchema } from '@postsop/contracts/auth'

import { notify } from '@/libs/notification'
import { useSignUpMutation } from '@/services/auth/mutations'

const signUpFormSchema = SignUpRequestSchema.extend({
  confirmPassword: password,
}).superRefine(({ confirmPassword, password }, ctx) => {
  if (password !== confirmPassword) {
    ctx.addIssue({
      code: 'custom',
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    })
  }
})

interface UseSignUpOptions {
  successCallback: () => void
}

export function useSignUp(options: UseSignUpOptions) {
  const { successCallback } = options

  const signUpMutation = useSignUpMutation()

  const signUpForm = useForm({
    defaultValues: {
      confirmPassword: '',
      email: '',
      password: '',
    },
    resolver: zodResolver(signUpFormSchema),
  })

  const handleSignUp = signUpForm.handleSubmit((data) => {
    if (signUpMutation.isPending) {
      return
    }

    const payload: SignUpRequest = {
      email: data.email,
      password: data.password,
    }

    signUpMutation.mutate(payload, {
      onSuccess: () => {
        notify({
          message: 'Account created, please sign in',
          onDispose: () => {
            successCallback()
          },
        })
      },
    })
  })

  return {
    signUpForm,
    handleSignUp,
    isRegistering: signUpMutation.isPending,
  }
}
