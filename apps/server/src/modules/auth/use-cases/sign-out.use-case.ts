import { Injectable } from '@nestjs/common'

import { RefreshSessionService } from '../services/refresh-session.service'

@Injectable()
export class SignOutUseCase {
  constructor(private readonly refreshSessionService: RefreshSessionService) {}

  async execute(sessionId: string) {
    await this.refreshSessionService.invalidateSession(sessionId)
  }
}
