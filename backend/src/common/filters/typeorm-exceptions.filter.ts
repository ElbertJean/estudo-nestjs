import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { Response } from 'express';

@Catch(QueryFailedError)
export class TypeOrmExceptionFilter implements ExceptionFilter {

    // Instanciamos o Logger oficial do NestJS
    private readonly logger = new Logger(TypeOrmExceptionFilter.name);

    catch(exception: QueryFailedError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        let status = HttpStatus.UNPROCESSABLE_ENTITY;
        let message = 'Erro de operação no banco de dados.';

        const pgError = exception as any;

        // Erros de violação conhecidos (O usuário precisa saber)
        if (pgError.code === '23505') {
            status = HttpStatus.CONFLICT;
            message = 'Este registro já existe e não pode ser duplicado.';
        } else if (pgError.code === '23503') {
            status = HttpStatus.NOT_FOUND;
            message = 'O registro relacionado não foi encontrado no banco de dados.';
        } else {
            // CAIU NO FALLBACK GENÉRICO! 
            // 1. Gritamos no terminal para o Dev ver de cara o que aconteceu:
            this.logger.error(`🚨 Falha no Banco: ${pgError.message}`);
        }

        // Devolvemos a resposta
        response.status(status).json({
            statusCode: status,
            error: 'TypeORM Error',
            message: message,
            // 2. Opcional: Mandar o erro real pro Postman (TIRAR ISSO QUANDO FOR PRA PRODUÇÃO)
            detalhe_tecnico: pgError.message
        });
    }
}
