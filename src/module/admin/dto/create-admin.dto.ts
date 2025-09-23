import { IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { Role } from 'src/module/common/enums/role.enum';

export class CreateAdminDto {
    @IsString() @Length(1, 120) nombre: string;
    @IsString() @Length(3, 60) usuario: string;
    @IsString() @Length(6, 120) password: string;
    @IsOptional() @IsEnum(Role) rol?: Role;
}
