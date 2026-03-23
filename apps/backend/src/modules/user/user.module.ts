import { Module } from '@nestjs/common'

import { RoleModule } from '../role/role.module'
import { UserController } from './controllers/user.controller'
import { UserService } from './services/user.service'

@Module({
  imports: [RoleModule],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService],
})
export class UserModule {}
