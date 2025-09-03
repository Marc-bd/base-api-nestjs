import { Injectable, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@Injectable()
export class HashService {
  private readonly saltRounds = 10;

  async hash(value: string): Promise<string> {
    try {
      return await bcrypt.hash(value, this.saltRounds);
    } catch (error) {
      console.error("Erro ao gerar hash:", error);
      throw new InternalServerErrorException("Erro interno de criptografia");
    }
  }

  async compare(value: string, hash: string): Promise<boolean> {
    try {
      return await bcrypt.compare(value, hash);
    } catch (error) {
      console.error("Erro ao comparar hash:", error);
      throw new InternalServerErrorException("Erro interno de criptografia");
    }
  }
}
