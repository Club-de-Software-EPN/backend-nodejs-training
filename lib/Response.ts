import { Response as ExpressResponse } from 'express';

class Response {
    success(res: ExpressResponse, message: string, statusCode = 200) {
        res.status(statusCode).send({
            error: '',
            body: message
        });
    }

    error(res: ExpressResponse, message: string, statusCode = 500) {
        res.status(statusCode || 500).send({
            error: message,
            body: ''
        });
    }
}

export default Response;
