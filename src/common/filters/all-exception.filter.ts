import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";
import { QueryFailedError } from "typeorm";
import { POSTGRES_ERROR_MAP } from "../constants/postgres-error.map";
import { PostgresError } from "../interfaces/postgres-error.interfaces";

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = "Internal server error";

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();
      message =
        typeof res === "string" ? res : (res as { message: string }).message;
    }

    if (exception instanceof QueryFailedError) {
      const pgError = exception as PostgresError;

      const errorMap = POSTGRES_ERROR_MAP[pgError.code];

      if (errorMap) {
        status = errorMap.status;
        message = errorMap.message(pgError.detail);
      }
    }

    const timestamp = new Date().toLocaleString("pt-BR", {
      timeZone: "America/Sao_Paulo",
    });

    response.status(status).json({
      statusCode: status,
      timestamp: timestamp,
      path: request.url,
      message,
    });
  }
}
