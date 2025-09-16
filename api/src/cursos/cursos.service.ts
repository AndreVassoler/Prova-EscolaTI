import { Injectable } from '@nestjs/common';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { Curso } from './entities/curso.entity';
import { CursoDocument } from './schema/curso.schema';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';


@Injectable()
export class CursosService {
  constructor(@InjectModel(Curso.name) private readonly cursoModel: Model<CursoDocument>) {}


  async create(createUserDto: CreateCursoDto) {
    const created = await this.cursoModel.create(createUserDto);
    return created.toObject();
    
  }

  async findAll() {
    const docs = await this.cursoModel.find().lean().exec();
    return docs;
  }

  async findOne(id: string) {
    const doc = await this.cursoModel.findById(id).lean().exec();
    return doc ?? undefined;
  }

  async update(id: string, updateUserDto: UpdateCursoDto) {
     const updated = await this.cursoModel
        .findByIdAndUpdate(id, updateUserDto, { new: true, runValidators: true })
        .lean()
        .exec();
      return updated ?? undefined;
    
    }
  
  async remove(id: string) {
    const result = await this.cursoModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}
