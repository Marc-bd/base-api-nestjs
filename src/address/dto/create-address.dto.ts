import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsNumber,
  MinLength,
  MaxLength,
} from "class-validator";

export class CreateAddressDto {
  @IsString({ message: "Rua deve ser uma string" })
  @IsNotEmpty({ message: "Rua é obrigatória" })
  @MinLength(2, { message: "Rua deve ter pelo menos 2 caracteres" })
  street: string;

  @IsString({ message: "Número deve ser uma string" })
  @IsNotEmpty({ message: "Número é obrigatório" })
  number: string;

  @IsOptional()
  @IsString({ message: "Complemento deve ser uma string" })
  complement?: string;

  @IsString({ message: "Bairro deve ser uma string" })
  @IsNotEmpty({ message: "Bairro é obrigatório" })
  @MinLength(2, { message: "Bairro deve ter pelo menos 2 caracteres" })
  neighborhood: string;

  @IsString({ message: "Cidade deve ser uma string" })
  @IsNotEmpty({ message: "Cidade é obrigatória" })
  @MinLength(2, { message: "Cidade deve ter pelo menos 2 caracteres" })
  city: string;

  @IsString({ message: "Estado deve ser uma string" })
  @IsNotEmpty({ message: "Estado é obrigatório" })
  @MinLength(2, { message: "Estado deve ter pelo menos 2 caracteres" })
  state: string;

  @IsString({ message: "CEP deve ser uma string" })
  @IsNotEmpty({ message: "CEP é obrigatório" })
  @MinLength(8, { message: "CEP deve ter pelo menos 8 caracteres" })
  @MaxLength(9, { message: "CEP deve ter no máximo 9 caracteres" })
  zipCode: string;

  @IsString({ message: "País deve ser uma string" })
  @IsNotEmpty({ message: "País é obrigatório" })
  @MinLength(2, { message: "País deve ter pelo menos 2 caracteres" })
  country: string;

  @IsOptional()
  @IsNumber({}, { message: "Latitude deve ser um número" })
  latitude?: number;

  @IsOptional()
  @IsNumber({}, { message: "Longitude deve ser um número" })
  longitude?: number;
}
