import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiciplinaController } from './disciplina.controller';
import { DisciplinaService } from './disciplina.service';
import { Disciplina } from './entity/disciplina.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Disciplina])],
  controllers: [DiciplinaController],
  providers: [DisciplinaService],
})
export class DisciplinaModule {}
