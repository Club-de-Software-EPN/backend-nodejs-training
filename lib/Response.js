class Response {
    success (res, message, statusCode) {
        res.status(statusCode || 200).send({
            error: '',
            body: message
        });
    }

    error (res, message, statusCode) {
        res.status(statusCode || 500).send({
            error: message,
            body: ''
        });
    }
}

module.exports = Response;
