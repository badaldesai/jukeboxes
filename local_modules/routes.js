const bodyParser = require('body-parser');
const jukeboxes = require('./jukeboxes');

module.exports = {
    /**
     * All the routes for express app.
     * @param {Express} app - express app
     */
    getRoutes(app) {
        app.get(
            '/jukeboxes',
            bodyParser.json(),
            jukeboxes.jukeboxesList.bind(jukeboxes),
        );
    },
};
