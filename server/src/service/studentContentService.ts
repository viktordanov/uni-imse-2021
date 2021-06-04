import { Repository } from '../entities/repository'

export class StudentContentService {
  private repository: Repository
  constructor(repository: Repository) {
    this.repository = repository
  }
}
