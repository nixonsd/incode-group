import { AppAbility } from '../abilities';
import { IPolicyHandler } from '../interfaces';

type PolicyHandlerCallback = (ability: AppAbility) => boolean;

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback;
