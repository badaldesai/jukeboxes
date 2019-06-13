const express = require('express');
const routes = require('./routes');

const PORT = process.env.PORT || 3000;

module.exports = {
    initialize() {
        const app = express();
        app.listen(PORT);
        console.info(`API Server Started at port ${PORT}`);

        routes.getRoutes(app);
    },
};
