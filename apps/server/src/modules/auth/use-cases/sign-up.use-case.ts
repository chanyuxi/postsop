import { Injectable } from '@nestjs/common'

import type { SignUpRequest } from '@postsop/contracts/auth'

import { AppException } from '@/common/exceptions/app.exception'
import { CreateUserUseCase } from '@/modules/user/use-cases/create-user.use-case'

@Injectable()
export class SignUpUseCase {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  async execute(signUpRequest: SignUpRequest) {
    const user = await this.createUserUseCase.execute(signUpRequest)

    if (!user) {
      throw AppException.resourceAlreadyExists('User already exists')
    }
  }
}
