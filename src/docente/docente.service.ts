import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Documento } from './entities/documento.entity';

@Injectable()
export class DocumentoService {
  constructor(
    @InjectRepository(Documento)
    private documentoRepository: Repository<Documento>,
  ) {}

  async create(data: Partial<Documento>) {
    const doc = this.documentoRepository.create(data);
    return await this.documentoRepository.save(doc);
  }

  async findOne(id: number) {
    return await this.documentoRepository.findOneBy({ id });
  }

  async update(id: number, data: Partial<Documento>) {
    await this.documentoRepository.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number) {
    return await this.documentoRepository.delete(id);
  }
}
