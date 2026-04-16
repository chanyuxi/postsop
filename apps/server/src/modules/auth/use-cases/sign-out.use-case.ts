import { Injectable } from '@nestjs/common'

import { SessionService } from '../services/session.service'

@Injectable()
export class SignOutUseCase {
  constructor(private readonly sessionService: SessionService) {}

  async execute(sessionId: string) {
    await this.sessionService.invalidateSession(sessionId)
  }
}
