import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from '@shared/roles';
import { Exclude } from 'class-transformer';
import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from './constants';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @Column('varchar', { length: 64 })
  public name!: string;

  @Column('varchar', { length: 64 })
  public surname!: string;

  @Column('varchar', { length: 256, unique: true })
  public email!: string;

  @Exclude()
  @Column('varchar', { length: 64 })
  public password!: string;

  @Column({ type: 'enum', enum: Roles, default: Roles.REGULAR })
  public role!: Roles;

  @ManyToOne(() => User, (boss) => boss.email)
  @JoinColumn({ name: 'boss', referencedColumnName: 'email' })
  public boss!: string;

  @OneToMany(() => User, (subordinate) => subordinate.boss)
  public subordinates!: User[];

  @BeforeInsert()
  @BeforeUpdate()
  private async hashPassword() {
    this.password = await bcrypt.hash(this.password, SALT_ROUNDS);
  }
}
