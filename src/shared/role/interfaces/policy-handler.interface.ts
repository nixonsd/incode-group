import { AppAbility } from '../abilities';

export interface IPolicyHandler {
  handle(ability: AppAbility): boolean;
}
