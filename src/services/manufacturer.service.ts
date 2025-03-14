import type ManufacturerRepository from '@/repositories/manufacturer.repository';

class ManufacturerService {
  constructor(private readonly repository: ManufacturerRepository) {}

  async getManufacturerById(id: number) {
    return await this.repository.getManufacturer(id);
  }
}

export default ManufacturerService;
