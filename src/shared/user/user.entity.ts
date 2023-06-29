import bcrypt from 'bcrypt';
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Roles } from '@shared/roles';
import { Exclude } from 'class-transformer';
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

  @Exclude()
  @Column('varchar', { length: 64, nullable: true })
  public refreshToken!: string | null;

  @Column({ type: 'enum', enum: Roles, default: Roles.REGULAR })
  public role!: Roles;

  @ManyToOne(() => User, (boss) => boss.email)
  @JoinColumn({ name: 'boss', referencedColumnName: 'email' })
  public boss!: string;

  @OneToMany(() => User, (subordinate) => subordinate.boss)
  public subordinates!: User[];

  @BeforeInsert()
  @BeforeUpdate()
  private async hash() {
    if (this.password)
      this.password = await bcrypt.hash(this.password, SALT_ROUNDS);

    if (this.refreshToken)
      this.refreshToken = await bcrypt.hash(this.refreshToken, SALT_ROUNDS);
  }

  static async verifyHash(raw: string, hash: string) {
    return bcrypt.compare(raw, hash);
  }
}
