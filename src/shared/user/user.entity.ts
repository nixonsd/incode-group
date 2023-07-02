import bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SALT_ROUNDS } from './constants';
import { RoleEnum } from '@shared/role';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class User {
  @ApiProperty()
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @ApiProperty()
  @Column('varchar', { length: 64 })
  public name!: string;

  @ApiProperty()
  @Column('varchar', { length: 64 })
  public surname!: string;

  @ApiProperty()
  @Column('varchar', { length: 256, unique: true })
  public email!: string;

  @Exclude()
  @Column('varchar', { length: 64 })
  public password!: string;

  @Exclude()
  @Column('varchar', { length: 64, nullable: true })
  public refreshToken!: string | null;

  @ApiProperty({ enum: RoleEnum, enumName: 'RoleEnum' })
  @Column({ type: 'enum', enum: RoleEnum, default: RoleEnum.REGULAR })
  public role!: RoleEnum;

  @ApiProperty()
  @ManyToOne(() => User, (boss) => boss.email, { nullable: true })
  @JoinColumn({ name: 'boss', referencedColumnName: 'email' })
  @Column('varchar', { name: 'boss', length: 256, nullable: true })
  public boss!: string | null;

  @ApiProperty()
  @OneToMany(() => User, (subordinate) => subordinate.boss, { nullable: true })
  public subordinates!: User[] | null;

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
