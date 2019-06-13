const express = require('express');
const routes = require('./routes');

const PORT = process.env.PORT || 3000;

module.exports = {
    /**
     * Intialize the express app at particular port and set up routes
     */
    initialize() {
        const app = express();
        app.listen(PORT);
        console.info(`API Server Started at port ${PORT}`);

        routes.getRoutes(app);
    },
};
