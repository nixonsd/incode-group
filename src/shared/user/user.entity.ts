import bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { BeforeInsert, BeforeUpdate, Column, Entity, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent } from 'typeorm';
import { SALT_ROUNDS } from './constants';
import { RoleEnum } from '@shared/role';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
@Tree('closure-table', {
  closureTableName: 'subordinate_closure',
  ancestorColumnName: () => 'boss',
  descendantColumnName: () => 'subordinate',
})
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
  @TreeParent()
  public boss!: User | null;

  @ApiProperty()
  @TreeChildren()
  public subordinates!: User[] | null;

  @BeforeInsert()
  @BeforeUpdate()
  private async hash() {
    if (this.password)
      this.password = await bcrypt.hash(this.password, SALT_ROUNDS);

    if (this.refreshToken)
      this.refreshToken = await bcrypt.hash(this.refreshToken, SALT_ROUNDS);
  }

  static get modelName() {
    return 'User';
  }

  static async verifyHash(raw: string, hash: string) {
    return bcrypt.compare(raw, hash);
  }
}
