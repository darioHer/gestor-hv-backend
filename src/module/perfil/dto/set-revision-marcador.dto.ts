import { IsIn } from 'class-validator';

export class SetRevisionMarcadorDto {
    @IsIn(['FAVORITO', 'DESCARTAR', 'OBSERVAR'])
    marcador: 'FAVORITO' | 'DESCARTAR' | 'OBSERVAR';
}
