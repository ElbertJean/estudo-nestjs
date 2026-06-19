import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNotEmpty } from "class-validator";
import { UserRole } from "../enums/user-role.enum";

export class UpdateUserRoleDto {
    @ApiProperty({
        description: 'Novo perfil do usuário',
        enum: UserRole,
        example: UserRole.ADMIN
    })
    @IsEnum(UserRole, { message: 'O tipo de usuário deve ser admin ou free' })
    @IsNotEmpty({ message: 'O perfil/role é obrigatório' })
    role: UserRole;
}