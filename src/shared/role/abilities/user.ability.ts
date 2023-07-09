import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability';
import { User } from '@shared/user';
import { Injectable } from '@nestjs/common';
import { ActionEnum, RoleEnum } from '../types';

type Subjects = InferSubjects<typeof User | User, true> | 'all';
type DefinePermissions = (user: User, builder: AbilityBuilder<AppAbility>) => void;

type FlatUser = User & {
  // @ts-ignore
  'boss.email': User['boss']['email'];
};

const rolePermissions: Record<RoleEnum, DefinePermissions> = {
  [RoleEnum.BOSS](user, { can }) {
    can<FlatUser>(ActionEnum.Update, User, [ 'boss' ], { 'boss.email': user.email });
  },
  [RoleEnum.ADMINISTRATOR](user, { can, cannot }) {
    can(ActionEnum.Manage, 'all');
    cannot(ActionEnum.BeChanged, User, [ 'role' ]);
  },
  [RoleEnum.REGULAR](user, { can }) {
    can(ActionEnum.Check, 'all');
  },
};

export type AppAbility = Ability<[ActionEnum, Subjects]>;

@Injectable()
export class UserAbility {
  ofUser(user: User) {
    const builder = new AbilityBuilder<
      Ability<[ActionEnum, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    const { can, build } = builder;

    can(ActionEnum.Check, 'all');
    can(ActionEnum.BeChanged, User);

    if (typeof rolePermissions[user.role] === 'function') {
      rolePermissions[user.role](user, builder);
    } else {
      throw new Error(`Trying to use unknown role "${user.role}"`);
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
