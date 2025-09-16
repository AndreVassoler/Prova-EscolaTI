import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Disciplina } from './entity/disciplina.entity';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { Curso } from '../cursos/entities/curso.entity';


@Injectable()
export class DisciplinaService {
  constructor(@InjectRepository(Disciplina) private readonly disciplinaRepository: Repository<Disciplina>) {}


  async create(createDisciplinaDto: CreateDisciplinaDto) {
    const created = this.disciplinaRepository.create({
      nome: createDisciplinaDto.nome,
      curso: { id: createDisciplinaDto.cursoId } as Curso,
    });
    const saved = await this.disciplinaRepository.save(created);
    return saved;
  }

  async findAll() {
    return this.disciplinaRepository.find({ relations: ['curso'] });
  }

  async findOne(id: number) {
    const found = await this.disciplinaRepository.findOne({ where: { id }, relations: ['curso'] });
    return found ?? undefined;
  }

  async update(id: number, updateDisciplinaDto: UpdateDisciplinaDto) {
    await this.disciplinaRepository.update({ id }, { nome: updateDisciplinaDto.nome });
    const updated = await this.disciplinaRepository.findOne({ where: { id }, relations: ['curso'] });
    return updated ?? undefined;
  }

  async remove(id: number) {
    const result = await this.disciplinaRepository.delete({ id });
    return (result.affected ?? 0) > 0;
  }
}
