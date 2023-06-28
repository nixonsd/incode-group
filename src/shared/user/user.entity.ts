import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  readonly id!: number;

  @Column()
  readonly name!: string;
}
