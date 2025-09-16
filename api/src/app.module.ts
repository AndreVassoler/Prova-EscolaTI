import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CursosModule } from './cursos/cursos.module';
import { DisciplinaModule } from './disciplina/disciplina.module';
import { Curso } from './cursos/entities/curso.entity';
import { Disciplina } from './disciplina/entity/disciplina.entity';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.PGHOST || 'localhost',
      port: Number(process.env.PGPORT || 5432),
      username: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'postgres',
      database: process.env.PGDATABASE || 'postgres',
      entities: [Curso, Disciplina],
      synchronize: (process.env.TYPEORM_SYNC ?? 'true') === 'true',
    }),
    CursosModule,
    DisciplinaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}


