const logger = require("../utils/logger");
class Logger {

    static async monitor(req, res, next) {

        const start = Date.now();

        // logger.info(`${req.method} ${req.url}`);

        res.on('finish',() => {

            const duration = Date.now() - start;
            logger.info(`${req.method} ${req.url} - Status: ${res.statusCode} - Duration: ${duration}ms`);
        });

        res.on('error', (err) => {
            logger.error(`${req.method} ${req.url} - Error: ${err.message}`);
        });

        next();
    };

}

module.exports = Logger;