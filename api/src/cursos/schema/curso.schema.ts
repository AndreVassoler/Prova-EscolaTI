import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CursoDocument = HydratedDocument<Curso>;

@Schema()
export class Curso {
  @Prop({ required: true })
  nome: string;

  @Prop({ required: true })
  cargaHoraria: number;

  @Prop({ required: true })
  dataInicio: Date;
}

export const CursoSchema = SchemaFactory.createForClass(Curso);
