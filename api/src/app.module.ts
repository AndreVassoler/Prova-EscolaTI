import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CursosModule } from './cursos/cursos.module';
import { DisciplinaModule } from './disciplina/disciplina.module';
import { MongooseModule } from '@nestjs/mongoose';


@Module({
  imports: [CursosModule, DisciplinaModule, MongooseModule.forRoot('mongodb://localhost/nest')],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


