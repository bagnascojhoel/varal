import { Cep } from './cep';
import { Coordinates } from './coordinates';

export type LocalityRequest = {
  cep?: Cep;
  coordinates?: Coordinates;
};
