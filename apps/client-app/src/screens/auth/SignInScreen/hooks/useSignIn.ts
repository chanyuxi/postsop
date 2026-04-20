import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import type { SignUpRequest } from '@postsop/contracts/auth'
import { SignInRequestSchema } from '@postsop/contracts/auth'

import { useAuth } from '@/hooks'
import { useSignInMutation } from '@/services/auth/mutations/useSignInMutation'

const defaultValues: SignUpRequest = {
  email: __DEV__ ? 'admin@example.com' : '',
  password: __DEV__ ? 'password' : '',
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
        // TODO: After successful login, immediately request permission and other information(To be determined)

        signIn(authSession)
      },
    })
  })

  return {
    loginForm,
    handleSignIn,
    isSignIning: signInMutation.isPending,
  }
}
