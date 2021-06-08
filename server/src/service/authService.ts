import { Repository } from '../entities/repository'

export class AuthService {
  private repository: Repository
  constructor(repository: Repository) {
    this.repository = repository
  }
}
