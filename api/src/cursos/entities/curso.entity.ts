import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { OneToMany } from 'typeorm';
import { Disciplina } from '../../disciplina/entity/disciplina.entity';

@Entity({ name: 'cursos' })
export class Curso {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 255 })
    nome: string;

    @Column({ type: 'int' })
    cargaHoraria: number;

    @Column({ type: 'date', name: 'data_inicio' })
    dataInicio: Date;

    @OneToMany(() => Disciplina, (disciplina) => disciplina.curso, { cascade: false })
    disciplinas: Disciplina[];
}
