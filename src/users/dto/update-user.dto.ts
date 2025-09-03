import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from "class-validator";

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @ValidateIf((o: UpdateUserDto) => o.newPassword !== undefined)
  @IsString()
  @MinLength(6)
  @IsNotEmpty({ message: "Para alterar a senha, envie também a senha antiga" })
  oldPassword?: string;

  @ValidateIf((o: UpdateUserDto) => o.oldPassword !== undefined)
  @IsString()
  @MinLength(6)
  @IsNotEmpty({ message: "Para alterar a senha, envie também a senha nova" })
  newPassword?: string;
}
