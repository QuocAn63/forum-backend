import { IsNotEmpty, MaxLength } from "class-validator";

export class PermissionCreateDto {
    @IsNotEmpty()
    @MaxLength(20)
    id: string

    @IsNotEmpty()
    description: string
}