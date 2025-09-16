import { Module } from '@nestjs/common';
import { CursosService } from './cursos.service';
import { CursosController } from './cursos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { CursoSchema } from './schema/curso.schema';
import { Curso } from './entities/curso.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Curso.name, schema: CursoSchema  }])],
  controllers: [CursosController],
  providers: [CursosService],
})
export class CursosModule {}
