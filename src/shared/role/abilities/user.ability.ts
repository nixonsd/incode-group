import { Ability, AbilityBuilder, AbilityClass, ExtractSubjectType, InferSubjects, MongoAbility } from '@casl/ability';
import { User } from '@shared/user';
import { Injectable } from '@nestjs/common';
import { ActionEnum, RoleEnum } from '../types';

type Subjects = InferSubjects<typeof User> | 'all';

export type AppAbility = MongoAbility<[ActionEnum, Subjects]>;

@Injectable()
export class UserAbility {
  ofUser(user: User) {
    const { can, build } = new AbilityBuilder<
      MongoAbility<[ActionEnum, Subjects]>
    >(Ability as AbilityClass<AppAbility>);

    if (user.role === RoleEnum.ADMINISTRATOR)
      can(ActionEnum.Manage, 'all');
    else
      can(ActionEnum.Read, 'all');

    can(ActionEnum.Update, User, { id: user.id });
    can(ActionEnum.Update, User, { boss: user.boss });

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }
}
