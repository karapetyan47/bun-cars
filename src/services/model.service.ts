import type ModelRepository from '@/repositories/model.repository';

class ModelService {
  constructor(private readonly repository: ModelRepository) {}

  async getModelById(id: number) {
    return await this.repository.getModel(id);
  }
}

export default ModelService;
