import { HttpStatus } from "@nestjs/common";

export const POSTGRES_ERROR_MAP: Record<
  string,
  { status: number; message: (detail?: string) => string }
> = {
  "22001": {
    status: HttpStatus.BAD_REQUEST,
    message: (detail?: string) => {
      const columnMatch = detail?.match(
        /value too long for type character varying\((\d+)\)/,
      );
      return columnMatch
        ? `Valor excede tamanho máximo (${columnMatch[1]})`
        : "Valor muito grande para chave";
    },
  },

  "22003": {
    status: HttpStatus.BAD_REQUEST,
    message: () => "Valor numérico fora do intervalo permitido",
  },

  "22007": {
    status: HttpStatus.BAD_REQUEST,
    message: () => "Formato de data/hora inválido",
  },

  "22012": {
    status: HttpStatus.BAD_REQUEST,
    message: () => "Divisão por zero",
  },

  "23502": {
    status: HttpStatus.BAD_REQUEST,
    message: (detail?: string) => {
      const columnMatch = detail?.match(/null value in column "(.*?)"/);
      const column = columnMatch ? columnMatch[1] : "desconhecida";
      return `Chave obrigatória não informada: ${column}`;
    },
  },

  "23505": {
    status: HttpStatus.CONFLICT,
    message: (detail?: string) => {
      const keyMatch = detail?.match(/Key \((.*?)\)=/);
      const duplicateKey = keyMatch ? keyMatch[1] : "desconhecida";
      return `Chave duplicada: ${duplicateKey}`;
    },
  },
  "23503": {
    status: HttpStatus.BAD_REQUEST,
    message: (detail?: string) => {
      if (!detail) return "Violação de chave estrangeira";
      const keyMatch = detail.match(/Key \((.*?)\)=/);
      const tableMatch = detail.match(/table "(.*?)"/);

      const column = keyMatch ? keyMatch[1] : "desconhecida";
      const table = tableMatch ? tableMatch[1] : "desconhecida";

      return `Violação de chave estrangeira: coluna '${column}' referenciando tabela '${table}'`;
    },
  },
  "23514": {
    status: HttpStatus.BAD_REQUEST,
    message: (detail?: string) => {
      if (!detail) return "Violação de restrição CHECK";
      const constraintMatch = detail.match(/constraint "(.*?)"/i);
      const constraint = constraintMatch ? constraintMatch[1] : "desconhecida";
      return `Violação de restrição CHECK: ${constraint}`;
    },
  },
};
