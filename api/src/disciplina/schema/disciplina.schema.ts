
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type DisciplinaDocument = HydratedDocument<Disciplinas>;

@Schema()
export class Disciplinas {
  @Prop({required: true })
  nome: string;
}

export const DisciplinaSchema = SchemaFactory.createForClass(Disciplinas);
