import {
  IsEmail,
  IsString,
  MinLength,
  IsNotEmpty,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { CreateAddressDto } from "../../address/dto/create-address.dto";

export class CreateUserDto {
  @IsString({ message: "Nome deve ser uma string" })
  @IsNotEmpty({ message: "Nome é obrigatório" })
  @MinLength(2, { message: "Nome deve ter pelo menos 2 caracteres" })
  name: string;

  @IsEmail({}, { message: "Email deve ter um formato válido" })
  @IsNotEmpty({ message: "Email é obrigatório" })
  email: string;

  @IsString({ message: "Senha deve ser uma string" })
  @MinLength(6, { message: "Senha deve ter pelo menos 6 caracteres" })
  @IsNotEmpty({ message: "Senha é obrigatória" })
  password: string;

  @ValidateNested()
  @Type(() => CreateAddressDto)
  @IsNotEmpty({ message: "Endereço é obrigatório" })
  address: CreateAddressDto;
}
