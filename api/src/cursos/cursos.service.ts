import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Curso } from './entities/curso.entity';


@Injectable()
export class CursosService {
  constructor(@InjectRepository(Curso) private readonly cursoRepository: Repository<Curso>) {}


  async create(createCursoDto: CreateCursoDto) {
    const created = this.cursoRepository.create({
      nome: createCursoDto.nome,
      cargaHoraria: createCursoDto.cargaHoraria,
  dataInicio: createCursoDto.dataInicio as unknown as Date,
    });
    const saved = await this.cursoRepository.save(created);
    return saved;
  }

  async findAll() {
    return this.cursoRepository.find({ relations: ['disciplinas'] });
  }

  async findOne(id: number) {
    const found = await this.cursoRepository.findOne({ where: { id }, relations: ['disciplinas'] });
    return found ?? undefined;
  }

  async update(id: number, updateCursoDto: UpdateCursoDto) {
    await this.cursoRepository.update({ id }, {
      nome: updateCursoDto.nome,
      cargaHoraria: updateCursoDto.cargaHoraria,
  dataInicio: updateCursoDto.dataInicio as unknown as Date,
    });
    const updated = await this.cursoRepository.findOne({ where: { id }, relations: ['disciplinas'] });
    return updated ?? undefined;
  }
  
  async remove(id: number) {
    const result = await this.cursoRepository.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
