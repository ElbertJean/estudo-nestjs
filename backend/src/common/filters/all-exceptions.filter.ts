import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
    catch(exception: any, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        // Loga o erro no terminal para podermos debugar depois
        Logger.error('Erro Capturado no Fallback Global', exception);

        // Se for um erro padrão do NestJS (ex: um BadRequest do class-validator), mantemos o status dele
        // Se for um erro bizarro que ninguém tratou, forçamos o 500
        const status = exception instanceof HttpException
            ? exception.getStatus()
            : HttpStatus.INTERNAL_SERVER_ERROR;

        const message = exception instanceof HttpException
            ? exception.getResponse()
            : 'Internal server error';

        response.status(status).json({
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            message: message['message'] || message,
        });
    }
}
