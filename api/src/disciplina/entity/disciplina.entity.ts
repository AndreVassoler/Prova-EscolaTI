import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Curso } from '../../cursos/entities/curso.entity';

@Entity({ name: 'disciplinas' })
export class Disciplina {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'varchar', length: 255 })
    nome: string;

    @ManyToOne(() => Curso, (curso) => curso.disciplinas, { onDelete: 'CASCADE', nullable: false })
    @JoinColumn({ name: 'curso_id' })
    curso: Curso;
}
