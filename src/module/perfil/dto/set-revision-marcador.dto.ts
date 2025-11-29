import { IsIn } from 'class-validator';
import { MarcadorRevision } from '../enums/marcador.enum';

export class SetRevisionMarcadorDto {
    @IsIn(Object.values(MarcadorRevision))
    marcador: MarcadorRevision;
}