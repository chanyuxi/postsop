import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { SignInRequestSchema } from '@postsop/contracts/auth'

import { useAuth } from '@/hooks'
import { toast } from '@/libs/toast'
import { useSignInMutation } from '@/services/auth/mutations/useSignInMutation'

const defaultValues = {
  email: 'admin@example.com',
  password: 'password',
}

export function useSignIn() {
  const { signIn } = useAuth()

  const signInMutation = useSignInMutation()

  const loginForm = useForm({
    defaultValues,
    resolver: zodResolver(SignInRequestSchema),
  })

  const handleSignIn = loginForm.handleSubmit(async (data) => {
    if (signInMutation.isPending) {
      return
    }

    signInMutation.mutate(data, {
      onSuccess: (authSession) => {
        signIn(authSession)

        if (__DEV__) {
          toast('Sign in successful')
        }
      },
    })
  })

  return {
    loginForm,
    handleSignIn,
    isSignIning: signInMutation.isPending,
  }
}
