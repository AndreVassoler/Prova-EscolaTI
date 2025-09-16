import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiciplinaController } from './disciplina.controller';
import { DisciplinaService } from './disciplina.service';
import { Disciplinas, DisciplinaSchema } from './schema/disciplina.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: Disciplinas.name, schema: DisciplinaSchema  }])],
  controllers: [DiciplinaController],
  providers: [DisciplinaService],
})
export class DisciplinaModule {}
