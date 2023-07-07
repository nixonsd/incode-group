import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects } from '@casl/ability';
import { User } from '@shared/user';
import { Injectable } from '@nestjs/common';
import { ActionEnum, RoleEnum } from '../types';

type Subjects = InferSubjects<typeof User> | 'all';

export type AppAbility = Ability<[ActionEnum, Subjects]>;

@Injectable()
export class UserAbility {
  ofUser(user: User) {
    const { can, cannot, build } = new AbilityBuilder<
      Ability<[ActionEnum, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.role === RoleEnum.ADMINISTRATOR) {
      can(ActionEnum.Manage, 'all');
      cannot(ActionEnum.BeChanged, User);
    } else {
      can(ActionEnum.Check, 'all');
    }

    if (user.role !== RoleEnum.REGULAR)
      can(ActionEnum.Update, User, { boss: { email: user.email } });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
