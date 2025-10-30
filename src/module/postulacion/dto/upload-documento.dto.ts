    // dto/upload-documento.dto.ts
import { IsEnum, IsNotEmpty } from 'class-validator';
import { DocumentType } from '../../common/enums/document-type.enum';

export class UploadDocumentoDto {
  @IsEnum(DocumentType)
  @IsNotEmpty()
  tipoDocumento: DocumentType;
}