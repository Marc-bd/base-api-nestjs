import { Injectable } from "@nestjs/common";

@Injectable()
export class AppService {
  getHealth() {
    const now = new Date();
    const timestamp = now.toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });

    return {
      status: "ok",
      timestamp,
    };
  }
}
