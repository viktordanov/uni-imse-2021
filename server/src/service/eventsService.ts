import { Repository } from '../entities/repository'

export class EventsService {
  private repository: Repository
  constructor(repository: Repository) {
    this.repository = repository
  }
}
