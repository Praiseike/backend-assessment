
class Logger {

        static monitor(req, res, next) {

        const start = Date.now();

        console.log(`ON REQUEST [${new Date().toISOString()}] ${req.method} ${req.url}`);

        res.on('finish', async () => {

            const duration = Date.now() - start; 

            console.log(`ON RESPONSE [${new Date().toISOString()}] ${req.method} ${req.url} - Status: ${res.statusCode} - Duration: ${duration}ms`);
        });

        res.on('error', (err) => {
            console.error(`ON ERROR [${new Date().toISOString()}] ${req.method} ${req.url} - Error: ${err.message}`);
        });

        next();
    };

}

module.exports = Logger;