import { Module } from '@nestjs/common'

import { RoleModule } from '../role/role.module'
import { UserController } from './controllers/user.controller'
import { UserAuthQueryService } from './queries/user-auth.query.service'
import { UserProfileQueryService } from './queries/user-profile.query.service'
import { CreateUserUseCase } from './use-cases/create-user.use-case'

@Module({
  imports: [RoleModule],
  providers: [CreateUserUseCase, UserAuthQueryService, UserProfileQueryService],
  controllers: [UserController],
  exports: [CreateUserUseCase, UserAuthQueryService, UserProfileQueryService],
})
export class UserModule {}
