import { Boot } from './boot';

export class User {
  id: number;
  voorletters: string;
  tussenvoegsel: string
  naam: string;
  telefoon: string;
  email: string;
  thuishaven: string;
  opmerking: string;
  boot: Boot; 
  bootId: number;
  naamCompleet: string;
}
