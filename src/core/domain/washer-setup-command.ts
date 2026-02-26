import { Cep } from './cep';
import { Coordinates } from './coordinates';
import { IllegalState } from './illegal-state-error';

export class WasherSetupCommand {
  private _acceptLocale?: string;

  private constructor(
    readonly coordinates?: Coordinates,
    readonly cep?: Cep,
    acceptLocale?: string,
  ) {
    if (coordinates && cep) {
      throw new IllegalState(
        'can only filter by coordinates or cep one at a time',
      );
    }
    if (!coordinates && !cep) {
      throw new IllegalState('need at least one of: coordinates or cep');
    }
    this._acceptLocale = acceptLocale;
  }

  static ofCoordinates(
    coordinates: Coordinates,
    acceptLocale?: string,
  ): WasherSetupCommand {
    return new WasherSetupCommand(coordinates, undefined, acceptLocale);
  }

  static ofCep(cep: Cep, acceptLocale?: string): WasherSetupCommand {
    return new WasherSetupCommand(undefined, cep, acceptLocale);
  }

  get acceptLocale(): string {
    return this._acceptLocale ?? 'pt-BR';
  }
}
