import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { SignUpDto } from '@postsop/contracts/type'

import { toast } from '@/libs/toast'
import { useSignUpMutation } from '@/services/auth/mutations/useSignUpMutation'

const signUpFormSchema = SignUpDto.extend({
  confirmPassword: z.string().min(6),
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

    const payload: SignUpDto = {
      email: data.email,
      password: data.password,
    }

    signUpMutation.mutate(payload, {
      onSuccess: () => {
        toast('Account created, please sign in')
        successCallback()
      },
    })
  })

  return {
    signUpForm,
    handleSignUp,
    isRegistering: signUpMutation.isPending,
  }
}
