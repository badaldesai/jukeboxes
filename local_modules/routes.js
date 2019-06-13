const bodyParser = require('body-parser');
const jukeboxes = require('./jukeboxes');

module.exports = {
    getRoutes(app) {
        app.get(
            '/jukeboxes',
            bodyParser.json(),
            jukeboxes.jukeboxesList.bind(jukeboxes),
        );
    },
};
