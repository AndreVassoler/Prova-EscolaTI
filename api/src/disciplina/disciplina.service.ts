import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { DisciplinaDocument, Disciplinas } from './schema/disciplina.schema';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';


@Injectable()
export class DisciplinaService {
  constructor(@InjectModel(Disciplinas.name) private readonly disciplinaModel: Model<DisciplinaDocument>) {}


  async create(createDisciplinaDto: CreateDisciplinaDto) {
    const created = await this.disciplinaModel.create(createDisciplinaDto);
    return created.toObject();
    
  }

  async findAll() {
    const docs = await this.disciplinaModel.find().lean().exec();
    return docs;
  }

  async findOne(id: string) {
    const doc = await this.disciplinaModel.findById(id).lean().exec();
    return doc ?? undefined;
  }

  async update(id: string, updateDisciplinaDto: UpdateDisciplinaDto) {
      const updated = await this.disciplinaModel
        .findByIdAndUpdate(id, updateDisciplinaDto, { new: true, runValidators: true })
        .lean()
        .exec();
      return updated ?? undefined;
    }

  async remove(id: string) {
    const result = await this.disciplinaModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
