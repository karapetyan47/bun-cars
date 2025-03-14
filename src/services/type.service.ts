import type TypeRepository from '@/repositories/type.repository';

class TypeService {
  constructor(private readonly repository: TypeRepository) {}

  async getTypeById(id: string) {
    return await this.repository.getType(id);
  }
}

export default TypeService;
